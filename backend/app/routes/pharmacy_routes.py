import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Pharmacy, PharmacyInventory, Medicine
from ..schemas import PharmacyResponse, PharmacyInventoryItem

router = APIRouter(prefix="/api/pharmacies", tags=["Pharmacies"])

def calculate_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("", response_model=List[PharmacyResponse])
def get_pharmacies(
    user_lat: Optional[float] = Query(None),
    user_lng: Optional[float] = Query(None),
    delivery_only: bool = Query(False),
    medicine_id: Optional[int] = Query(None),
    available_only: bool = Query(False),
    sort_by: str = Query("nearest", description="nearest, price, rating"),
    db: Session = Depends(get_db)
):
    query = db.query(Pharmacy)
    if delivery_only:
        query = query.filter(Pharmacy.home_delivery_available == True)

    pharmacies = query.all()
    results = []

    for pharm in pharmacies:
        distance = None
        if isinstance(user_lat, (int, float)) and isinstance(user_lng, (int, float)):
            distance = calculate_haversine(user_lat, user_lng, pharm.latitude, pharm.longitude)


        med_price = None
        med_stock = None
        med_avail = None

        if medicine_id:
            inv = db.query(PharmacyInventory).filter(
                PharmacyInventory.pharmacy_id == pharm.id,
                PharmacyInventory.medicine_id == medicine_id
            ).first()
            if inv:
                med_price = inv.price
                med_stock = inv.stock_quantity
                med_avail = inv.is_available and inv.stock_quantity > 0
            else:
                med_price = None
                med_stock = 0
                med_avail = False

            if available_only and not med_avail:
                continue

        p_dict = {
            "id": pharm.id,
            "name": pharm.name,
            "address": pharm.address,
            "city": pharm.city,
            "phone": pharm.phone,
            "email": pharm.email,
            "latitude": pharm.latitude,
            "longitude": pharm.longitude,
            "opening_hours": pharm.opening_hours,
            "home_delivery_available": pharm.home_delivery_available,
            "delivery_fee": pharm.delivery_fee,
            "rating": pharm.rating,
            "created_at": pharm.created_at,
            "distance_km": distance,
            "medicine_price": med_price,
            "medicine_stock": med_stock,
            "medicine_available": med_avail
        }
        results.append(PharmacyResponse(**p_dict))

    # Apply sorting
    if sort_by == "nearest" and user_lat is not None:
        results.sort(key=lambda p: p.distance_km if p.distance_km is not None else 9999.0)
    elif sort_by == "price" and medicine_id:
        results.sort(key=lambda p: p.medicine_price if p.medicine_price is not None else 9999.0)
    elif sort_by == "rating":
        results.sort(key=lambda p: p.rating, reverse=True)

    return results

@router.get("/{pharmacy_id}")
def get_pharmacy_details(
    pharmacy_id: int,
    user_lat: Optional[float] = Query(None),
    user_lng: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    pharm = db.query(Pharmacy).filter(Pharmacy.id == pharmacy_id).first()
    if not pharm:
        raise HTTPException(status_code=404, detail="Pharmacy not found.")

    distance = None
    if isinstance(user_lat, (int, float)) and isinstance(user_lng, (int, float)):
        distance = calculate_haversine(user_lat, user_lng, pharm.latitude, pharm.longitude)


    inventory_items = (
        db.query(PharmacyInventory, Medicine)
        .join(Medicine, Medicine.id == PharmacyInventory.medicine_id)
        .filter(PharmacyInventory.pharmacy_id == pharmacy_id)
        .all()
    )

    inventory_list = []
    for inv, med in inventory_items:
        inventory_list.append({
            "id": inv.id,
            "medicine_id": med.id,
            "medicine_name": med.name,
            "generic_name": med.generic_name,
            "strength": med.strength,
            "dosage_form": med.dosage_form,
            "category": med.category,
            "price": inv.price,
            "stock_quantity": inv.stock_quantity,
            "is_available": inv.is_available and inv.stock_quantity > 0,
            "updated_at": inv.updated_at
        })

    pharm_info = PharmacyResponse(
        id=pharm.id,
        name=pharm.name,
        address=pharm.address,
        city=pharm.city,
        phone=pharm.phone,
        email=pharm.email,
        latitude=pharm.latitude,
        longitude=pharm.longitude,
        opening_hours=pharm.opening_hours,
        home_delivery_available=pharm.home_delivery_available,
        delivery_fee=pharm.delivery_fee,
        rating=pharm.rating,
        created_at=pharm.created_at,
        distance_km=distance
    )

    return {
        "pharmacy": pharm_info,
        "inventory": inventory_list
    }
