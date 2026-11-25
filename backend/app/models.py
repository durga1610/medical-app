from datetime import datetime, timezone
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, UniqueConstraint
)
from sqlalchemy.orm import relationship
from .database import Base

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=True)
    address = Column(Text, nullable=True)
    role = Column(String(50), default="user")  # "user", "pharmacy", "delivery", "admin"
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"), nullable=True)
    created_at = Column(DateTime, default=utc_now)

    pharmacy = relationship("Pharmacy", back_populates="managers")
    reservations = relationship("Reservation", back_populates="user")
    orders = relationship("Order", foreign_keys="[Order.user_id]", back_populates="user")
    assigned_deliveries = relationship("Order", foreign_keys="[Order.delivery_user_id]", back_populates="delivery_partner")



class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    generic_name = Column(String(255), index=True, nullable=False)
    strength = Column(String(100), nullable=False)
    dosage_form = Column(String(100), nullable=False)  # Tablet, Capsule, Syrup, Ointment, Sachet, Drops
    manufacturer = Column(String(255), nullable=False)
    category = Column(String(100), index=True, nullable=False)  # Analgesic, Antibiotic, Antacid, etc.
    description = Column(Text, nullable=True)
    usage_instructions = Column(Text, nullable=True)
    side_effects = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    ocr_keywords = Column(Text, nullable=True)  # Comma-separated alternative tokens for OCR matching
    created_at = Column(DateTime, default=utc_now)

    inventories = relationship("PharmacyInventory", back_populates="medicine", cascade="all, delete-orphan")


class Pharmacy(Base):
    __tablename__ = "pharmacies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    address = Column(String(500), nullable=False)
    city = Column(String(100), default="Central City", nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    opening_hours = Column(String(150), default="8:00 AM - 10:00 PM", nullable=False)
    home_delivery_available = Column(Boolean, default=True)
    delivery_fee = Column(Float, default=30.0)
    rating = Column(Float, default=4.7)
    created_at = Column(DateTime, default=utc_now)

    managers = relationship("User", back_populates="pharmacy")
    inventory_items = relationship("PharmacyInventory", back_populates="pharmacy", cascade="all, delete-orphan")
    reservations = relationship("Reservation", back_populates="pharmacy")
    orders = relationship("Order", back_populates="pharmacy")


class PharmacyInventory(Base):
    __tablename__ = "pharmacy_inventory"
    __table_args__ = (
        UniqueConstraint("pharmacy_id", "medicine_id", name="_pharmacy_medicine_uc"),
    )

    id = Column(Integer, primary_key=True, index=True)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    price = Column(Float, nullable=False)
    stock_quantity = Column(Integer, default=0, nullable=False)
    is_available = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    pharmacy = relationship("Pharmacy", back_populates="inventory_items")
    medicine = relationship("Medicine", back_populates="inventories")


class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)
    reservation_code = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    delivery_type = Column(String(50), default="COLLECTION")  # "COLLECTION" or "DELIVERY"
    delivery_address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    total_amount = Column(Float, default=0.0)
    status = Column(
        String(50),
        default="Pending"
    )  # "Pending", "Confirmed", "Rejected", "Ready for Collection", "Completed", "Cancelled"
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", back_populates="reservations")
    pharmacy = relationship("Pharmacy", back_populates="reservations")
    items = relationship("ReservationItem", back_populates="reservation", cascade="all, delete-orphan")
    order = relationship("Order", back_populates="reservation", uselist=False)


class ReservationItem(Base):
    __tablename__ = "reservation_items"

    id = Column(Integer, primary_key=True, index=True)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    reservation = relationship("Reservation", back_populates="items")
    medicine = relationship("Medicine")


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_code = Column(String(64), unique=True, index=True, nullable=False)
    reservation_id = Column(Integer, ForeignKey("reservations.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    delivery_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    pharmacy_id = Column(Integer, ForeignKey("pharmacies.id"), nullable=False)
    customer_name = Column(String(255), nullable=False)
    customer_phone = Column(String(50), nullable=False)
    delivery_type = Column(String(50), default="DELIVERY")  # "DELIVERY" or "COLLECTION"
    delivery_address = Column(Text, nullable=True)
    total_amount = Column(Float, default=0.0)
    status = Column(
        String(50),
        default="Order Placed"
    )  # "Order Placed", "Pharmacy Confirmed", "Preparing", "Ready for Delivery", "Out for Delivery", "Delivered", "Cancelled"
    tracking_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    user = relationship("User", foreign_keys=[user_id], back_populates="orders")
    delivery_partner = relationship("User", foreign_keys=[delivery_user_id], back_populates="assigned_deliveries")
    pharmacy = relationship("Pharmacy", back_populates="orders")
    reservation = relationship("Reservation", back_populates="order")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")



class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    medicine_id = Column(Integer, ForeignKey("medicines.id"), nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    unit_price = Column(Float, nullable=False)
    subtotal = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")
    medicine = relationship("Medicine")
