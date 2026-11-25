from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    User, Pharmacy, Medicine, PharmacyInventory,
    Reservation, ReservationItem, Order, OrderItem
)
from ..schemas import (
    PharmacyResponse, PharmacyInventoryItem, PharmacyInventoryUpdate,
    PharmacyProfileUpdate, ReservationResponse, ReservationStatusUpdate,
    OrderResponse, OrderStatusUpdate
)
from ..auth import get_current_pharmacy
from .reservation_routes import format_reservation_response, format_order_response

router = APIRouter(prefix="/api/pharmacy-admin", tags=["Pharmacy Admin Dashboard"])

@router.get("/profile", response_model=PharmacyResponse)
def get_pharmacy_profile(
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    pharm = db.query(Pharmacy).filter(Pharmacy.id == current_pharmacy_user.pharmacy_id).first()
    if not pharm:
        raise HTTPException(status_code=404, detail="Associated pharmacy not found.")
    return PharmacyResponse.model_validate(pharm)

@router.put("/profile", response_model=PharmacyResponse)
def update_pharmacy_profile(
    payload: PharmacyProfileUpdate,
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    pharm = db.query(Pharmacy).filter(Pharmacy.id == current_pharmacy_user.pharmacy_id).first()
    if not pharm:
        raise HTTPException(status_code=404, detail="Associated pharmacy not found.")

    if payload.name:
        pharm.name = payload.name
    if payload.address:
        pharm.address = payload.address
    if payload.phone:
        pharm.phone = payload.phone
    if payload.opening_hours:
        pharm.opening_hours = payload.opening_hours
    if payload.home_delivery_available is not None:
        pharm.home_delivery_available = payload.home_delivery_available
    if payload.delivery_fee is not None:
        pharm.delivery_fee = payload.delivery_fee

    db.commit()
    db.refresh(pharm)
    return PharmacyResponse.model_validate(pharm)

@router.get("/inventory", response_model=List[PharmacyInventoryItem])
def get_pharmacy_inventory(
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    items = (
        db.query(PharmacyInventory, Medicine)
        .join(Medicine, Medicine.id == PharmacyInventory.medicine_id)
        .filter(PharmacyInventory.pharmacy_id == current_pharmacy_user.pharmacy_id)
        .order_by(Medicine.name.asc())
        .all()
    )

    out = []
    for inv, med in items:
        out.append(PharmacyInventoryItem(
            id=inv.id,
            medicine_id=med.id,
            medicine_name=med.name,
            generic_name=med.generic_name,
            strength=med.strength,
            dosage_form=med.dosage_form,
            category=med.category,
            price=inv.price,
            stock_quantity=inv.stock_quantity,
            is_available=inv.is_available,
            updated_at=inv.updated_at
        ))
    return out

@router.put("/inventory/{medicine_id}", response_model=PharmacyInventoryItem)
def update_inventory_item(
    medicine_id: int,
    payload: PharmacyInventoryUpdate,
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    inv = db.query(PharmacyInventory).filter(
        PharmacyInventory.pharmacy_id == current_pharmacy_user.pharmacy_id,
        PharmacyInventory.medicine_id == medicine_id
    ).first()

    med = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medicine not found.")

    if not inv:
        inv = PharmacyInventory(
            pharmacy_id=current_pharmacy_user.pharmacy_id,
            medicine_id=medicine_id,
            price=payload.price,
            stock_quantity=payload.stock_quantity,
            is_available=payload.is_available
        )
        db.add(inv)
    else:
        inv.price = payload.price
        inv.stock_quantity = payload.stock_quantity
        inv.is_available = payload.is_available and (payload.stock_quantity > 0)

    db.commit()
    db.refresh(inv)

    return PharmacyInventoryItem(
        id=inv.id,
        medicine_id=med.id,
        medicine_name=med.name,
        generic_name=med.generic_name,
        strength=med.strength,
        dosage_form=med.dosage_form,
        category=med.category,
        price=inv.price,
        stock_quantity=inv.stock_quantity,
        is_available=inv.is_available,
        updated_at=inv.updated_at
    )

@router.get("/reservations", response_model=List[ReservationResponse])
def get_pharmacy_reservations(
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    reservations = (
        db.query(Reservation)
        .filter(Reservation.pharmacy_id == current_pharmacy_user.pharmacy_id)
        .order_by(Reservation.created_at.desc())
        .all()
    )
    return [format_reservation_response(r) for r in reservations]

@router.put("/reservations/{reservation_id}/status", response_model=ReservationResponse)
def update_reservation_status(
    reservation_id: int,
    payload: ReservationStatusUpdate,
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    res = db.query(Reservation).filter(
        Reservation.id == reservation_id,
        Reservation.pharmacy_id == current_pharmacy_user.pharmacy_id
    ).first()

    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found for your pharmacy.")

    valid_statuses = ["Pending", "Confirmed", "Rejected", "Ready for Collection", "Completed", "Cancelled"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    old_status = res.status
    res.status = payload.status
    if payload.notes:
        res.notes = payload.notes

    # If transitioning to Rejected or Cancelled from an active state, restore inventory
    if payload.status in ["Rejected", "Cancelled"] and old_status not in ["Rejected", "Cancelled"]:
        for itm in res.items:
            inv = db.query(PharmacyInventory).filter(
                PharmacyInventory.pharmacy_id == res.pharmacy_id,
                PharmacyInventory.medicine_id == itm.medicine_id
            ).first()
            if inv:
                inv.stock_quantity += itm.quantity
                inv.is_available = True

    # Keep linked order status in sync
    linked_order = db.query(Order).filter(Order.reservation_id == res.id).first()
    if linked_order:
        if payload.status == "Confirmed":
            linked_order.status = "Pharmacy Confirmed"
            linked_order.tracking_notes = "Pharmacy confirmed reservation and is assembling items."
        elif payload.status == "Ready for Collection":
            linked_order.status = "Preparing"
            linked_order.tracking_notes = "Medicine packed and kept ready at pharmacy counter."
        elif payload.status == "Completed":
            linked_order.status = "Delivered"
            linked_order.tracking_notes = "Package collected / delivered successfully."
        elif payload.status in ["Rejected", "Cancelled"]:
            linked_order.status = "Cancelled"
            linked_order.tracking_notes = f"Reservation status: {payload.status}."

    db.commit()
    db.refresh(res)
    return format_reservation_response(res)

@router.get("/orders", response_model=List[OrderResponse])
def get_pharmacy_orders(
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .filter(Order.pharmacy_id == current_pharmacy_user.pharmacy_id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [format_order_response(o) for o in orders]

@router.put("/orders/{order_id}/status", response_model=OrderResponse)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdate,
    current_pharmacy_user: User = Depends(get_current_pharmacy),
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.pharmacy_id == current_pharmacy_user.pharmacy_id
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found for your pharmacy.")

    valid_statuses = [
        "Order Placed", "Pharmacy Confirmed", "Preparing", "Ready for Delivery",
        "Picked up from Pharmacy", "Out for Delivery", "Delivered", "Cancelled"
    ]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
        )

    order.status = payload.status
    if payload.tracking_notes:
        order.tracking_notes = payload.tracking_notes
    else:
        if payload.status == "Pharmacy Confirmed":
            order.tracking_notes = "Pharmacy confirmed order and is reviewing prescription."
        elif payload.status == "Preparing":
            order.tracking_notes = "Pharmacist is assembling and securely sealing the medicine package."
        elif payload.status == "Ready for Delivery":
            order.tracking_notes = "Prescription verified & packed. Dispatched to nearby courier fleet for pickup."
        elif payload.status == "Delivered":
            order.tracking_notes = "Order successfully delivered to customer."


    # If linked to a reservation, sync state
    if order.reservation:
        if payload.status == "Pharmacy Confirmed":
            order.reservation.status = "Confirmed"
        elif payload.status == "Delivered":
            order.reservation.status = "Completed"
        elif payload.status == "Cancelled":
            order.reservation.status = "Cancelled"

    db.commit()
    db.refresh(order)
    return format_order_response(order)
