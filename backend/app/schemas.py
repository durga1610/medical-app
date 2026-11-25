from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

# ----------------- Auth & User Schemas -----------------
class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    email: str = Field(..., min_length=5, max_length=255)
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    confirm_password: str
    address: Optional[str] = None
    role: Optional[str] = "user"
    pharmacy_id: Optional[int] = None

class UserLoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=255)
    password: str


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str]
    address: Optional[str]
    role: str
    pharmacy_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ----------------- Medicine Schemas -----------------
class MedicineBase(BaseModel):
    name: str
    generic_name: str
    strength: str
    dosage_form: str
    manufacturer: str
    category: str
    description: Optional[str] = None
    usage_instructions: Optional[str] = None
    side_effects: Optional[str] = None
    image_url: Optional[str] = None

class MedicineResponse(MedicineBase):
    id: int
    ocr_keywords: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Pharmacy & Inventory Schemas -----------------
class PharmacyInventoryItem(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    generic_name: str
    strength: str
    dosage_form: str
    category: str
    price: float
    stock_quantity: int
    is_available: bool
    updated_at: datetime

class PharmacyBase(BaseModel):
    name: str
    address: str
    city: str
    phone: str
    email: str
    latitude: float
    longitude: float
    opening_hours: str
    home_delivery_available: bool
    delivery_fee: float
    rating: float

class PharmacyResponse(PharmacyBase):
    id: int
    created_at: datetime
    distance_km: Optional[float] = None
    # For a specific medicine search query
    medicine_price: Optional[float] = None
    medicine_stock: Optional[int] = None
    medicine_available: Optional[bool] = None

    class Config:
        from_attributes = True

class PharmacyInventoryUpdate(BaseModel):
    medicine_id: int
    price: float = Field(..., gt=0)
    stock_quantity: int = Field(..., ge=0)
    is_available: bool = True

class PharmacyProfileUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    opening_hours: Optional[str] = None
    home_delivery_available: Optional[bool] = None
    delivery_fee: Optional[float] = None

# ----------------- OCR Matching Schemas -----------------
class OcrMatchRequest(BaseModel):
    extracted_text: str = Field(..., description="Raw text extracted by Tesseract OCR")

class OcrMatchCandidate(BaseModel):
    medicine: MedicineResponse
    confidence: float
    match_reasons: List[str]
    matched_tokens: List[str]

class OcrMatchResponse(BaseModel):
    extracted_text: str
    clean_tokens: List[str]
    candidates: List[OcrMatchCandidate]
    message: str

# ----------------- Reservation & Order Schemas -----------------
class CartItemInput(BaseModel):
    medicine_id: int
    quantity: int = Field(..., gt=0)

class ReservationCreateRequest(BaseModel):
    pharmacy_id: int
    customer_name: str
    customer_phone: str
    delivery_type: str = Field("COLLECTION", description="COLLECTION or DELIVERY")
    delivery_address: Optional[str] = None
    notes: Optional[str] = None
    items: List[CartItemInput] = Field(..., min_items=1)

class ReservationItemResponse(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    strength: str
    dosage_form: str
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True

class ReservationResponse(BaseModel):
    id: int
    reservation_code: str
    pharmacy_id: int
    pharmacy_name: str
    pharmacy_address: str
    pharmacy_phone: str
    customer_name: str
    customer_phone: str
    delivery_type: str
    delivery_address: Optional[str]
    notes: Optional[str]
    total_amount: float
    status: str
    created_at: datetime
    updated_at: datetime
    items: List[ReservationItemResponse]

    class Config:
        from_attributes = True

class ReservationStatusUpdate(BaseModel):
    status: str = Field(..., description="Pending, Confirmed, Rejected, Ready for Collection, Completed, Cancelled")
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str = Field(..., description="Order Placed, Pharmacy Confirmed, Preparing, Ready for Delivery, Picked up from Pharmacy, Out for Delivery, Delivered, Cancelled")
    tracking_notes: Optional[str] = None


class OrderItemResponse(BaseModel):
    id: int
    medicine_id: int
    medicine_name: str
    strength: str
    quantity: int
    unit_price: float
    subtotal: float

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    order_code: str
    reservation_id: Optional[int]
    pharmacy_id: int
    pharmacy_name: str
    pharmacy_address: Optional[str] = None
    pharmacy_phone: Optional[str] = None
    delivery_user_id: Optional[int] = None
    delivery_partner_name: Optional[str] = None
    delivery_partner_phone: Optional[str] = None
    customer_name: str
    customer_phone: str
    delivery_type: str
    delivery_address: Optional[str]
    total_amount: float
    status: str
    tracking_notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True

class DeliveryStatusUpdateRequest(BaseModel):
    status: str = Field(..., description="Picked up from Pharmacy, Out for Delivery, Delivered")
    tracking_notes: Optional[str] = None

class DeliveryStatsResponse(BaseModel):
    total_completed: int
    active_deliveries: int
    total_earnings: float
    rating: float

