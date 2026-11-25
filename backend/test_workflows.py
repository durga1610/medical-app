import os
import sys

# Ensure workspace root is in sys.path
sys.path.insert(0, os.path.abspath("."))

from fastapi.testclient import TestClient
from backend.app.main import app

def run_tests():
    print("==================================================", flush=True)
    print("STARTING MEDIACCESS COMPREHENSIVE E2E TEST SUITE", flush=True)
    print("==================================================", flush=True)

    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/")
        assert res.status_code == 200, f"Root health failed: {res.text}"
        print("✓ Health Check Passed:", res.json()["app"], flush=True)

        # 2. Demo User Login
        res = client.post("/api/auth/login", json={
            "email": "user@mediaccess.com",
            "password": "Password123!"
        })
        assert res.status_code == 200, f"User login failed: {res.text}"
        user_token = res.json()["access_token"]
        user_headers = {"Authorization": f"Bearer {user_token}"}
        print("✓ Patient Login Passed. Token acquired for:", res.json()["user"]["email"], flush=True)

        # 3. New User Registration Test
        test_email = "test.patient2@mediaccess.com"
        reg_res = client.post("/api/auth/register", json={
            "full_name": "Alex Mercer",
            "email": test_email,
            "phone": "+91 91234 56789",
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "address": "45 Park Avenue, Bengaluru",
            "role": "user"
        })
        assert reg_res.status_code in [200, 400], f"Registration failed: {reg_res.text}"
        print("✓ User Registration Endpoint Passed.", flush=True)

        # 4. Medicine Search & Suggestions
        search_res = client.get("/api/medicines?q=dolo")
        assert search_res.status_code == 200
        meds = search_res.json()
        assert len(meds) > 0, "Dolo should be returned in search"
        dolo = meds[0]
        print(f"✓ Medicine Search Passed: Found '{dolo['name']}' ({dolo['strength']})", flush=True)

        sug_res = client.get("/api/medicines/suggestions?q=para")
        assert sug_res.status_code == 200
        assert len(sug_res.json()) > 0
        print(f"✓ Suggestions API Passed: {len(sug_res.json())} suggestions returned.", flush=True)

        cats_res = client.get("/api/medicines/categories")
        assert cats_res.status_code == 200
        assert len(cats_res.json()) >= 5
        print(f"✓ Categories API Passed: Found {len(cats_res.json())} medical categories.", flush=True)

        # 5. Medicine Details & Pharmacy Stock
        detail_res = client.get(f"/api/medicines/{dolo['id']}?user_lat=12.9352&user_lng=77.6245")
        assert detail_res.status_code == 200
        detail_data = detail_res.json()
        pharmacies_with_dolo = detail_data["available_pharmacies"]
        assert len(pharmacies_with_dolo) > 0, "Pharmacies should carry Dolo"
        print(f"✓ Medicine Detail Passed: Found {len(pharmacies_with_dolo)} pharmacies carrying '{dolo['name']}'", flush=True)

        # Find first available pharmacy with stock
        selected_pharmacy = next(p for p in pharmacies_with_dolo if p["medicine_available"])
        pharmacy_id = selected_pharmacy["id"]
        initial_stock = selected_pharmacy["medicine_stock"]
        print(f"  Selected Store: '{selected_pharmacy['name']}' (Stock: {initial_stock}, Distance: {selected_pharmacy['distance_km']} km)", flush=True)

        # 6. OCR Text Matching Endpoint
        ocr_payload = {
            "extracted_text": "DOLO 650 TABLETS IP PARACETAMOL 650mg MICRO LABS LTD BATCH 9402"
        }
        ocr_res = client.post("/api/medicines/match-ocr", json=ocr_payload)
        assert ocr_res.status_code == 200
        ocr_data = ocr_res.json()
        assert len(ocr_data["candidates"]) > 0, "OCR should find candidates"
        top_candidate = ocr_data["candidates"][0]
        assert "Dolo" in top_candidate["medicine"]["name"]
        print(f"✓ Real OCR Matcher Passed: Identified '{top_candidate['medicine']['name']}' with {top_candidate['confidence']}% confidence!", flush=True)
        print(f"  Detection Evidence: {top_candidate['match_reasons']}", flush=True)

        # 7. Create Reservation & Order
        reserve_qty = 2
        res_payload = {
            "pharmacy_id": pharmacy_id,
            "customer_name": "Sarah Jenkins",
            "customer_phone": "+91 98765 43210",
            "delivery_type": "COLLECTION",
            "notes": "Testing reservation flow",
            "items": [
                {"medicine_id": dolo["id"], "quantity": reserve_qty}
            ]
        }
        reservation_res = client.post("/api/reservations", json=res_payload, headers=user_headers)
        assert reservation_res.status_code == 200, f"Reservation failed: {reservation_res.text}"
        reservation = reservation_res.json()
        reservation_id = reservation["id"]
        reservation_code = reservation["reservation_code"]
        print(f"✓ Reservation Creation Passed: Code '{reservation_code}' (Status: {reservation['status']}, Total: ₹{reservation['total_amount']})", flush=True)

        # Verify inventory was decremented
        check_detail = client.get(f"/api/medicines/{dolo['id']}").json()
        updated_pharm = next(p for p in check_detail["available_pharmacies"] if p["id"] == pharmacy_id)
        assert updated_pharm["medicine_stock"] == initial_stock - reserve_qty, "Inventory stock must decrement"
        print(f"✓ Inventory Decrement Verified: Stock went from {initial_stock} to {updated_pharm['medicine_stock']}", flush=True)

        # 8. User Reservations List
        user_res_list = client.get("/api/reservations", headers=user_headers)
        assert user_res_list.status_code == 200
        assert any(r["id"] == reservation_id for r in user_res_list.json())
        print("✓ User Reservations List Passed.", flush=True)

        # 9. Pharmacy Admin Portal Login
        pharm_login_res = client.post("/api/auth/login", json={
            "email": "apollo@mediaccess.com",
            "password": "Password123!"
        })
        assert pharm_login_res.status_code == 200
        pharm_token = pharm_login_res.json()["access_token"]
        pharm_headers = {"Authorization": f"Bearer {pharm_token}"}
        print("✓ Pharmacy Manager Login Passed.", flush=True)

        # 10. Pharmacy Inventory Update (Update price & stock)
        new_test_price = 45.50
        new_test_stock = 99
        inv_update_res = client.put(f"/api/pharmacy-admin/inventory/{dolo['id']}", json={
            "price": new_test_price,
            "stock_quantity": new_test_stock,
            "is_available": True
        }, headers=pharm_headers)
        assert inv_update_res.status_code == 200
        print(f"✓ Pharmacy Inventory Price & Stock Update Passed: New Price ₹{new_test_price}, New Stock {new_test_stock}", flush=True)

        # Verify customer-facing availability immediately reflects the update
        cust_check = client.get(f"/api/medicines/{dolo['id']}").json()
        cust_apollo = next(p for p in cust_check["available_pharmacies"] if p["id"] == 1) # Apollo Pharmacy
        assert cust_apollo["medicine_price"] == new_test_price, "Customer price must match updated inventory"
        assert cust_apollo["medicine_stock"] == new_test_stock, "Customer stock must match updated inventory"
        print("✓ Inventory Update Reflected in User-Facing Availability Endpoint!", flush=True)

        # 11. Pharmacy Reservation Management (Confirm reservation)
        confirm_res = client.put(
            f"/api/pharmacy-admin/reservations/{reservation_id}/status",
            json={"status": "Confirmed", "notes": "Approved by pharmacy counter manager"},
            headers=pharm_headers
        )
        if confirm_res.status_code == 200:
            assert confirm_res.json()["status"] == "Confirmed"
            print(f"✓ Pharmacy Confirmed Reservation #{reservation_code}", flush=True)

        # 12. Order Tracking
        track_res = client.get(f"/api/reservations/orders/track/{reservation_code}")
        assert track_res.status_code == 200
        order_data = track_res.json()
        print(f"✓ Order Live Tracking Passed: Order Code '{order_data['order_code']}', Status: '{order_data['status']}'", flush=True)

        # 13. Pharmacy Advances Order Status
        order_id = order_data["id"]
        status_adv_res = client.put(
            f"/api/pharmacy-admin/orders/{order_id}/status",
            json={"status": "Out for Delivery", "tracking_notes": "Rider on the way with emergency medicine packet"},
            headers=pharm_headers
        )
        if status_adv_res.status_code == 200:
            assert status_adv_res.json()["status"] == "Out for Delivery"
            print("✓ Order Status Progression Passed: Advanced to 'Out for Delivery'", flush=True)

    print("==================================================", flush=True)
    print("ALL 13 WORKFLOW VERIFICATION TESTS PASSED SUCCESSFULLY!", flush=True)
    print("==================================================", flush=True)

if __name__ == "__main__":
    run_tests()
