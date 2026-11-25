from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User, Order, Reservation
from ..schemas import OrderResponse, DeliveryStatusUpdateRequest, DeliveryStatsResponse
from ..auth import get_current_delivery_user
from .reservation_routes import format_order_response

router = APIRouter(prefix="/api/delivery", tags=["Delivery Partner Portal"])

@router.get("/available-jobs", response_model=List[OrderResponse])
def get_available_delivery_jobs(
    current_driver: User = Depends(get_current_delivery_user),
    db: Session = Depends(get_db)
):
    """List orders that require home delivery and haven't been picked up by a driver yet."""
    orders = (
        db.query(Order)
        .filter(
            Order.delivery_type == "DELIVERY",
            Order.delivery_user_id == None,
            Order.status.in_(["Order Placed", "Pharmacy Confirmed", "Preparing", "Ready for Delivery"])
        )
        .order_by(Order.created_at.desc())
        .all()
    )
    return [format_order_response(o) for o in orders]

@router.get("/my-deliveries", response_model=List[OrderResponse])
def get_my_deliveries(
    current_driver: User = Depends(get_current_delivery_user),
    db: Session = Depends(get_db)
):
    """List all deliveries assigned to the logged-in delivery agent."""
    orders = (
        db.query(Order)
        .filter(Order.delivery_user_id == current_driver.id)
        .order_by(Order.updated_at.desc())
        .all()
    )
    return [format_order_response(o) for o in orders]

@router.post("/accept/{order_id}", response_model=OrderResponse)
def accept_delivery_job(
    order_id: int,
    current_driver: User = Depends(get_current_delivery_user),
    db: Session = Depends(get_db)
):
    """Driver accepts an available delivery job."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found.")

    if order.delivery_user_id is not None and order.delivery_user_id != current_driver.id:
        raise HTTPException(status_code=400, detail="This delivery job was already accepted by another driver.")

    if order.status in ["Delivered", "Cancelled"]:
        raise HTTPException(status_code=400, detail=f"Cannot accept order with status '{order.status}'.")

    order.delivery_user_id = current_driver.id
    order.status = "Out for Delivery"
    order.tracking_notes = f"Accepted by delivery courier {current_driver.full_name} ({current_driver.phone or 'Courier Service'}). En route to pharmacy/customer."

    db.commit()
    db.refresh(order)
    return format_order_response(order)

@router.put("/status/{order_id}", response_model=OrderResponse)
def update_delivery_status(
    order_id: int,
    payload: DeliveryStatusUpdateRequest,
    current_driver: User = Depends(get_current_delivery_user),
    db: Session = Depends(get_db)
):
    """Driver advances delivery phase (Picked up from Pharmacy, Out for Delivery, Delivered)."""
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.delivery_user_id == current_driver.id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found or not assigned to you.")

    valid_statuses = ["Picked up from Pharmacy", "Out for Delivery", "Delivered"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid delivery status. Must be one of: {', '.join(valid_statuses)}"
        )

    order.status = payload.status
    if payload.tracking_notes:
        order.tracking_notes = payload.tracking_notes
    else:
        if payload.status == "Picked up from Pharmacy":
            order.tracking_notes = f"Picked up from {order.pharmacy.name}. On way to customer address."
        elif payload.status == "Delivered":
            order.tracking_notes = "Delivered successfully to customer doorstep."

    # If delivered, also mark linked reservation completed
    if payload.status == "Delivered" and order.reservation:
        order.reservation.status = "Completed"

    db.commit()
    db.refresh(order)
    return format_order_response(order)

@router.get("/stats", response_model=DeliveryStatsResponse)
def get_delivery_stats(
    current_driver: User = Depends(get_current_delivery_user),
    db: Session = Depends(get_db)
):
    """Returns summary statistics for the delivery dashboard."""
    assigned_orders = db.query(Order).filter(Order.delivery_user_id == current_driver.id).all()
    completed = [o for o in assigned_orders if o.status == "Delivered"]
    active = [o for o in assigned_orders if o.status not in ["Delivered", "Cancelled"]]

    # Earnings calculation: ₹40 per completed delivery
    total_earnings = len(completed) * 40.0

    return DeliveryStatsResponse(
        total_completed=len(completed),
        active_deliveries=len(active),
        total_earnings=total_earnings,
        rating=4.9
    )
