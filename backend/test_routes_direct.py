import os
import sys

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath("."))

from backend.app.database import SessionLocal, engine, Base
from backend.app.seed import seed_database
from backend.app.models import User, Medicine, Pharmacy, PharmacyInventory
from backend.app.schemas import (
    UserRegisterRequest, UserLoginRequest, OcrMatchRequest,
    ReservationCreateRequest, CartItemInput, PharmacyInventoryUpdate,
    ReservationStatusUpdate, OrderStatusUpdate, DeliveryStatusUpdateRequest
)
from backend.app.routes import (
    auth_routes, medicine_routes, pharmacy_routes,
    reservation_routes, pharmacy_admin_routes, delivery_routes
)


def test_all():
    print("==================================================")
    print("STARTING DIRECT ROUTE & SERVICE VERIFICATION SUITE")
    print("==================================================")

    db = SessionLocal()
    try:
        # Seed database
        seed_database()

        # 1. Test Authentication - Login
        login_req = UserLoginRequest(email="user@mediaccess.com", password="Password123!")
        token_res = auth_routes.login(login_req, db)
        assert token_res.access_token is not None
        assert token_res.user.email == "user@mediaccess.com"
        print(f"✓ Login verification passed: {token_res.user.full_name} ({token_res.user.role})")

        # 2. Test User Registration
        try:
            reg_req = UserRegisterRequest(
                full_name="Direct Tester",
                email="tester@mediaccess.com",
                phone="+91 99999 88888",
                password="Password123!",
                confirm_password="Password123!",
                address="100 Tech Park",
                role="user"
            )
            reg_res = auth_routes.register(reg_req, db)
            assert reg_res.user.email == "tester@mediaccess.com"
            print("✓ User registration verification passed.")
        except Exception as e:
            if "already exists" in str(e):
                print("✓ User registration check: user already exists (idempotent).")
            else:
                raise e

        # 3. Test Medicine Search & Categories
        categories = medicine_routes.get_categories(db)
        assert len(categories) >= 5
        print(f"✓ Categories retrieved: {len(categories)} categories: {categories[:3]}...")

        search_res = medicine_routes.search_medicines(q="dolo", category=None, limit=10, db=db)
        assert len(search_res) > 0
        dolo_med = search_res[0]
        assert "Dolo" in dolo_med.name
        print(f"✓ Medicine search found: {dolo_med.name} ({dolo_med.strength}) - {dolo_med.generic_name}")

        suggestions = medicine_routes.get_suggestions(q="para", db=db)
        assert len(suggestions) > 0
        print(f"✓ Search suggestions found {len(suggestions)} matches for 'para'")

        # 4. Test OCR Matching Algorithm
        ocr_req = OcrMatchRequest(
            extracted_text="DOLO 650 TABLETS IP PARACETAMOL 650mg MICRO LABS LTD BATCH 9402"
        )
        ocr_res = medicine_routes.match_ocr(ocr_req, db)
        assert len(ocr_res.candidates) > 0
        top = ocr_res.candidates[0]
        assert "Dolo" in top.medicine.name
        assert top.confidence >= 50.0
        print(f"✓ OCR Match identified '{top.medicine.name}' with {top.confidence}% confidence")
        print(f"  Match reasons: {top.match_reasons}")

        # 5. Test Medicine Detail & Pharmacy Stock
        med_detail = medicine_routes.get_medicine_detail(
            medicine_id=dolo_med.id,
            user_lat=12.9352,
            user_lng=77.6245,
            db=db
        )
        pharmacies = med_detail["available_pharmacies"]
        assert len(pharmacies) > 0
        first_pharm = pharmacies[0]
        pharm_id = first_pharm["id"]
        initial_stock = first_pharm["medicine_stock"]
        print(f"✓ Pharmacy availability: '{first_pharm['name']}' has {initial_stock} units at ₹{first_pharm['medicine_price']} (dist: {first_pharm['distance_km']} km)")

        # 6. Test Reservation Creation & Stock Decrement
        user = db.query(User).filter(User.email == "user@mediaccess.com").first()
        reserve_req = ReservationCreateRequest(
            pharmacy_id=pharm_id,
            customer_name=user.full_name,
            customer_phone=user.phone or "+91 98765 43210",
            delivery_type="COLLECTION",
            notes="Testing direct reservation",
            items=[CartItemInput(medicine_id=dolo_med.id, quantity=2)]
        )
        res_out = reservation_routes.create_reservation(reserve_req, user, db)
        assert res_out.reservation_code.startswith("RES-")
        assert res_out.status == "Pending"
        assert res_out.total_amount > 0
        print(f"✓ Reservation created: #{res_out.reservation_code} for ₹{res_out.total_amount}")

        # Verify stock was decremented by 2
        inv_check = db.query(PharmacyInventory).filter(
            PharmacyInventory.pharmacy_id == pharm_id,
            PharmacyInventory.medicine_id == dolo_med.id
        ).first()
        assert inv_check.stock_quantity == initial_stock - 2
        print(f"✓ Stock decrement verified: from {initial_stock} to {inv_check.stock_quantity}")

        # 7. Test User Reservations Retrieval
        user_reservations = reservation_routes.get_user_reservations(user, db)
        assert any(r.id == res_out.id for r in user_reservations)
        print(f"✓ User reservations query returned {len(user_reservations)} reservation(s)")

        # 8. Test Pharmacy Manager Actions
        pharmacy_mgr = db.query(User).filter(User.email == "apollo@mediaccess.com").first()
        assert pharmacy_mgr is not None

        # Manager updates price & stock
        inv_up_req = PharmacyInventoryUpdate(
            medicine_id=dolo_med.id,
            price=42.00,
            stock_quantity=88,
            is_available=True
        )
        inv_updated = pharmacy_admin_routes.update_inventory_item(
            dolo_med.id, inv_up_req, pharmacy_mgr, db
        )
        assert inv_updated.price == 42.00
        assert inv_updated.stock_quantity == 88
        print(f"✓ Pharmacy Manager updated '{dolo_med.name}': price=₹42.00, stock=88")

        # Verify change is live in customer medicine detail endpoint
        new_detail = medicine_routes.get_medicine_detail(dolo_med.id, db=db)
        apollo_entry = next(p for p in new_detail["available_pharmacies"] if p["id"] == pharmacy_mgr.pharmacy_id)
        assert apollo_entry["medicine_price"] == 42.00
        assert apollo_entry["medicine_stock"] == 88
        print("✓ Live customer availability reflects pharmacy price & stock updates!")

        # 9. Test Reservation Status Progression
        res_status_req = ReservationStatusUpdate(status="Confirmed", notes="Packed and ready")
        # Ensure reservation belongs to manager's pharmacy for confirmation test
        if res_out.pharmacy_id == pharmacy_mgr.pharmacy_id:
            updated_res = pharmacy_admin_routes.update_reservation_status(
                res_out.id, res_status_req, pharmacy_mgr, db
            )
            assert updated_res.status == "Confirmed"
            print(f"✓ Pharmacy Manager confirmed reservation #{res_out.reservation_code}")

        # 10. Test Order Tracking
        order_track = reservation_routes.track_order_by_code(res_out.reservation_code, db)
        assert order_track.order_code.startswith("ORD-")
        print(f"✓ Live Order Tracking verified: #{order_track.order_code} (status: {order_track.status})")

        # 11. Test Phase 3 - Delivery Partner Workflow
        delivery_driver = db.query(User).filter(User.email == "delivery@mediaccess.com").first()
        assert delivery_driver is not None, "Delivery driver must exist"

        # Driver accepts delivery
        accepted_order = delivery_routes.accept_delivery_job(order_track.id, delivery_driver, db)
        assert accepted_order.status == "Out for Delivery"
        assert accepted_order.delivery_partner_name == delivery_driver.full_name
        print(f"✓ Phase 3: Delivery Driver '{delivery_driver.full_name}' accepted order #{order_track.order_code}")

        # Driver advances status to Delivered
        del_update = delivery_routes.update_delivery_status(
            order_track.id,
            DeliveryStatusUpdateRequest(status="Delivered", tracking_notes="Delivered to customer doorstep with confirmation."),
            delivery_driver,
            db
        )
        assert del_update.status == "Delivered"
        print(f"✓ Phase 3: Driver completed delivery for order #{order_track.order_code}!")

        # Delivery statistics check
        stats = delivery_routes.get_delivery_stats(delivery_driver, db)
        assert stats.total_completed >= 1
        print(f"✓ Phase 3: Driver statistics verified: {stats.total_completed} completed deliveries, ₹{stats.total_earnings} earnings.")

        print("==================================================")
        print("ALL TESTS PASSED WITH 100% SUCCESS ACROSS ALL 3 PHASES!")
        print("==================================================")


    finally:
        db.close()

if __name__ == "__main__":
    test_all()
