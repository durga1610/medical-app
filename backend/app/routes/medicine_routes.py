import math
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import or_
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Medicine, Pharmacy, PharmacyInventory
from ..schemas import (
    MedicineResponse, OcrMatchRequest, OcrMatchResponse, PharmacyResponse
)
from ..services.ocr_service import match_medicines_from_text

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])

def calculate_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance in kilometers between two lat/lon pairs."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("", response_model=List[MedicineResponse])
def search_medicines(
    q: Optional[str] = Query(None, description="Search term for name or generic name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Medicine)
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Medicine.name.ilike(term),
                Medicine.generic_name.ilike(term),
                Medicine.category.ilike(term),
                Medicine.manufacturer.ilike(term),
                Medicine.ocr_keywords.ilike(term)
            )
        )
    if category and category.strip():
        query = query.filter(Medicine.category.ilike(f"%{category.strip()}%"))

    return [MedicineResponse.model_validate(m) for m in query.limit(limit).all()]

@router.get("/suggestions")
def get_suggestions(q: str = Query(..., min_length=1), db: Session = Depends(get_db)):
    term = f"%{q.strip()}%"
    results = db.query(Medicine).filter(
        or_(Medicine.name.ilike(term), Medicine.generic_name.ilike(term))
    ).limit(8).all()

    return [
        {
            "id": m.id,
            "name": m.name,
            "generic_name": m.generic_name,
            "strength": m.strength,
            "dosage_form": m.dosage_form,
            "category": m.category
        }
        for m in results
    ]

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Medicine.category).distinct().all()
    return sorted([c[0] for c in categories if c[0]])

@router.post("/match-ocr", response_model=OcrMatchResponse)
def match_ocr(request: OcrMatchRequest, db: Session = Depends(get_db)):
    extracted = request.extracted_text.strip()
    if not extracted:
        raise HTTPException(status_code=400, detail="Extracted OCR text cannot be empty.")

    candidates, clean_tokens = match_medicines_from_text(db, extracted, min_confidence=20.0)

    msg = f"Found {len(candidates)} matching medicine candidate(s)."
    if not candidates:
        msg = "No direct medicine matches found from the extracted text. Please try scanning a clearer area or search manually."

    return OcrMatchResponse(
        extracted_text=extracted,
        clean_tokens=clean_tokens[:20],
        candidates=candidates[:5],
        message=msg
    )

@router.get("/{medicine_id}")
def get_medicine_detail(
    medicine_id: int,
    user_lat: Optional[float] = Query(None),
    user_lng: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found.")

    # Fetch pharmacies that carry this medicine
    inventory_records = (
        db.query(PharmacyInventory, Pharmacy)
        .join(Pharmacy, Pharmacy.id == PharmacyInventory.pharmacy_id)
        .filter(PharmacyInventory.medicine_id == medicine_id)
        .all()
    )

    pharmacies_list = []
    for inv, pharm in inventory_records:
        distance = None
        if isinstance(user_lat, (int, float)) and isinstance(user_lng, (int, float)):
            distance = calculate_haversine(user_lat, user_lng, pharm.latitude, pharm.longitude)


        pharm_dict = {
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
            "distance_km": distance,
            "medicine_price": inv.price,
            "medicine_stock": inv.stock_quantity,
            "medicine_available": inv.is_available and inv.stock_quantity > 0
        }
        pharmacies_list.append(pharm_dict)

    # Sort: available first, then distance or price
    pharmacies_list.sort(
        key=lambda p: (
            not p["medicine_available"],
            p["distance_km"] if p["distance_km"] is not None else 9999.0,
            p["medicine_price"] or 9999.0
        )
    )

    return {
        "medicine": MedicineResponse.model_validate(medicine),
        "available_pharmacies": pharmacies_list
    }
