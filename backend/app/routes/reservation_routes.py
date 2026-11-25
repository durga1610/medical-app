import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import (
    User, Pharmacy, Medicine, PharmacyInventory,
    Reservation, ReservationItem, Order, OrderItem
)
from ..schemas import (
    ReservationCreateRequest, ReservationResponse, ReservationItemResponse,
    OrderResponse, OrderItemResponse, ReservationStatusUpdate
)
from ..auth import get_current_user, get_current_user_optional

router = APIRouter(prefix="/api/reservations", tags=["Reservations & Orders"])

def format_reservation_response(res: Reservation) -> ReservationResponse:
    items_out = []
    for itm in res.items:
        items_out.append(ReservationItemResponse(
            id=itm.id,
            medicine_id=itm.medicine_id,
            medicine_name=itm.medicine.name if itm.medicine else "Medicine",
            strength=itm.medicine.strength if itm.medicine else "",
            dosage_form=itm.medicine.dosage_form if itm.medicine else "",
            quantity=itm.quantity,
            unit_price=itm.unit_price,
            subtotal=itm.subtotal
        ))

    return ReservationResponse(
        id=res.id,
        reservation_code=res.reservation_code,
        pharmacy_id=res.pharmacy_id,
        pharmacy_name=res.pharmacy.name if res.pharmacy else "Pharmacy",
        pharmacy_address=res.pharmacy.address if res.pharmacy else "",
        pharmacy_phone=res.pharmacy.phone if res.pharmacy else "",
        customer_name=res.customer_name,
        customer_phone=res.customer_phone,
        delivery_type=res.delivery_type,
        delivery_address=res.delivery_address,
        notes=res.notes,
        total_amount=res.total_amount,
        status=res.status,
        created_at=res.created_at,
        updated_at=res.updated_at,
        items=items_out
    )

def format_order_response(ord: Order) -> OrderResponse:
    items_out = []
    for itm in ord.items:
        items_out.append(OrderItemResponse(
            id=itm.id,
            medicine_id=itm.medicine_id,
            medicine_name=itm.medicine.name if itm.medicine else "Medicine",
            strength=itm.medicine.strength if itm.medicine else "",
            quantity=itm.quantity,
            unit_price=itm.unit_price,
            subtotal=itm.subtotal
        ))

    return OrderResponse(
        id=ord.id,
        order_code=ord.order_code,
        reservation_id=ord.reservation_id,
        pharmacy_id=ord.pharmacy_id,
        pharmacy_name=ord.pharmacy.name if ord.pharmacy else "Pharmacy",
        pharmacy_address=ord.pharmacy.address if ord.pharmacy else "",
        pharmacy_phone=ord.pharmacy.phone if ord.pharmacy else "",
        delivery_user_id=ord.delivery_user_id,
        delivery_partner_name=ord.delivery_partner.full_name if ord.delivery_partner else None,
        delivery_partner_phone=ord.delivery_partner.phone if ord.delivery_partner else None,
        customer_name=ord.customer_name,
        customer_phone=ord.customer_phone,
        delivery_type=ord.delivery_type,
        delivery_address=ord.delivery_address,
        total_amount=ord.total_amount,
        status=ord.status,
        tracking_notes=ord.tracking_notes,
        created_at=ord.created_at,
        updated_at=ord.updated_at,
        items=items_out
    )


@router.post("", response_model=ReservationResponse)
def create_reservation(
    payload: ReservationCreateRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    pharmacy = db.query(Pharmacy).filter(Pharmacy.id == payload.pharmacy_id).first()
    if not pharmacy:
        raise HTTPException(status_code=404, detail="Selected pharmacy not found.")

    if payload.delivery_type.upper() == "DELIVERY" and not pharmacy.home_delivery_available:
        raise HTTPException(
            status_code=400,
            detail=f"{pharmacy.name} does not offer home delivery. Please choose 'Collection' or pick another pharmacy."
        )

    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty.")

    # Calculate subtotal and verify stock
    total_amount = 0.0
    items_to_create = []

    for item_input in payload.items:
        inv = db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharmacy.id,
            PharmacyInventory.medicine_id == item_input.medicine_id
        ).first()

        med = db.query(Medicine).filter(Medicine.id == item_input.medicine_id).first()
        if not med:
            raise HTTPException(status_code=404, detail=f"Medicine ID {item_input.medicine_id} not found.")

        if not inv or not inv.is_available:
            raise HTTPException(
                status_code=400,
                detail=f"'{med.name}' is currently unavailable at {pharmacy.name}."
            )

        if inv.stock_quantity < item_input.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Requested quantity ({item_input.quantity}) for '{med.name}' exceeds available stock ({inv.stock_quantity})."
            )

        unit_price = inv.price
        subtotal = round(unit_price * item_input.quantity, 2)
        total_amount += subtotal

        # Decrement stock
        inv.stock_quantity -= item_input.quantity
        if inv.stock_quantity == 0:
            inv.is_available = False

        items_to_create.append({
            "medicine_id": med.id,
            "quantity": item_input.quantity,
            "unit_price": unit_price,
            "subtotal": subtotal
        })

    # Add delivery fee if home delivery
    if payload.delivery_type.upper() == "DELIVERY":
        total_amount += pharmacy.delivery_fee

    total_amount = round(total_amount, 2)

    # Generate codes
    short_uuid = uuid.uuid4().hex[:6].upper()
    res_code = f"RES-{short_uuid}"
    ord_code = f"ORD-{short_uuid}"

    user_id = current_user.id if current_user else None

    # Create Reservation
    reservation = Reservation(
        reservation_code=res_code,
        user_id=user_id,
        pharmacy_id=pharmacy.id,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        delivery_type=payload.delivery_type.upper(),
        delivery_address=payload.delivery_address,
        notes=payload.notes,
        total_amount=total_amount,
        status="Pending"
    )
    db.add(reservation)
    db.flush()

    for item_data in items_to_create:
        res_item = ReservationItem(
            reservation_id=reservation.id,
            medicine_id=item_data["medicine_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            subtotal=item_data["subtotal"]
        )
        db.add(res_item)

    # Create matching Order record for live tracking
    order = Order(
        order_code=ord_code,
        reservation_id=reservation.id,
        user_id=user_id,
        pharmacy_id=pharmacy.id,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        delivery_type=payload.delivery_type.upper(),
        delivery_address=payload.delivery_address,
        total_amount=total_amount,
        status="Order Placed",
        tracking_notes="Order successfully received and sent to pharmacy."
    )
    db.add(order)
    db.flush()

    for item_data in items_to_create:
        ord_item = OrderItem(
            order_id=order.id,
            medicine_id=item_data["medicine_id"],
            quantity=item_data["quantity"],
            unit_price=item_data["unit_price"],
            subtotal=item_data["subtotal"]
        )
        db.add(ord_item)

    db.commit()
    db.refresh(reservation)

    return format_reservation_response(reservation)

@router.get("", response_model=List[ReservationResponse])
def get_user_reservations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    reservations = (
        db.query(Reservation)
        .filter(Reservation.user_id == current_user.id)
        .order_by(Reservation.created_at.desc())
        .all()
    )
    return [format_reservation_response(r) for r in reservations]

@router.get("/{reservation_id}", response_model=ReservationResponse)
def get_reservation_by_id(
    reservation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    if res.user_id != current_user.id and current_user.role != "admin" and current_user.pharmacy_id != res.pharmacy_id:
        raise HTTPException(status_code=403, detail="Access denied.")

    return format_reservation_response(res)

@router.put("/{reservation_id}/cancel", response_model=ReservationResponse)
def cancel_reservation(
    reservation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    res = db.query(Reservation).filter(Reservation.id == reservation_id).first()
    if not res:
        raise HTTPException(status_code=404, detail="Reservation not found.")
    if res.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied.")

    if res.status in ["Completed", "Cancelled", "Rejected"]:
        raise HTTPException(status_code=400, detail=f"Cannot cancel a reservation with status '{res.status}'.")

    # Restore inventory stock
    for itm in res.items:
        inv = db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == res.pharmacy_id,
            PharmacyInventory.medicine_id == itm.medicine_id
        ).first()
        if inv:
            inv.stock_quantity += itm.quantity
            inv.is_available = True

    res.status = "Cancelled"

    # Also update linked order if any
    linked_order = db.query(Order).filter(Order.reservation_id == res.id).first()
    if linked_order:
        linked_order.status = "Cancelled"
        linked_order.tracking_notes = "Cancelled by user."

    db.commit()
    db.refresh(res)
    return format_reservation_response(res)

# ----------------- Orders Endpoints -----------------
@router.get("/user/orders", response_model=List[OrderResponse])
def get_user_orders(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )
    return [format_order_response(o) for o in orders]

@router.get("/orders/track/{order_code}", response_model=OrderResponse)
def track_order_by_code(order_code: str, db: Session = Depends(get_db)):
    ord = db.query(Order).filter(Order.order_code == order_code.upper()).first()
    if not ord:
        # Check by reservation code as fallback
        res = db.query(Reservation).filter(Reservation.reservation_code == order_code.upper()).first()
        if res and res.order:
            ord = res.order
        else:
            raise HTTPException(status_code=404, detail=f"Order with code '{order_code}' was not found.")

    return format_order_response(ord)
