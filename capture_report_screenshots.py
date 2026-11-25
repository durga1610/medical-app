import subprocess
import os
import time

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
assets_dir = os.path.abspath(r"report_assets")
os.makedirs(assets_dir, exist_ok=True)
profile_dir = os.path.join(assets_dir, "chrome_profile")

targets = [
    {
        "filename": "fig_4_1_a_login.png",
        "url": "http://localhost:5173/login",
        "size": "1280,850",
        "delay": 2
    },
    {
        "filename": "fig_4_1_b_home.png",
        "url": "http://localhost:5173/",
        "size": "1280,950",
        "delay": 2
    },
    {
        "filename": "fig_4_2_a_scanner.png",
        "url": "http://localhost:5173/scan",
        "size": "1280,950",
        "delay": 2
    },
    {
        "filename": "fig_4_2_b_search.png",
        "url": "http://localhost:5173/search",
        "size": "1280,900",
        "delay": 2
    },
    {
        "filename": "fig_4_2_c_medicine_detail.png",
        "url": "http://localhost:5173/medicines/2",
        "size": "1280,900",
        "delay": 2
    },
    {
        "filename": "fig_4_3_a_nearby_pharmacies.png",
        "url": "http://localhost:5173/nearby",
        "size": "1280,900",
        "delay": 2
    },
    {
        "filename": "fig_4_3_b_cart_checkout.png",
        "url": "http://localhost:5173/cart",
        "size": "1280,900",
        "delay": 2
    },
    {
        "filename": "fig_4_4_a_order_tracking.png",
        "url": "http://localhost:5173/login?autologin=user@mediaccess.com&redirect=/orders",
        "size": "1280,900",
        "delay": 3
    },
    {
        "filename": "fig_4_4_b_pharmacy_dashboard.png",
        "url": "http://localhost:5173/login?autologin=apollo@mediaccess.com&redirect=/pharmacy-dashboard",
        "size": "1280,900",
        "delay": 3
    },
    {
        "filename": "fig_4_5_delivery_portal.png",
        "url": "http://localhost:5173/login?autologin=delivery@mediaccess.com&redirect=/delivery-portal",
        "size": "1280,900",
        "delay": 3
    },
    {
        "filename": "appendix_j_github_repo.png",
        "url": "https://github.com/durga1610/medical-app",
        "size": "1280,850",
        "delay": 4
    }
]

print(f"Beginning capture of {len(targets)} project screenshots...")

for item in targets:
    out_file = os.path.join(assets_dir, item["filename"])
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={profile_dir}",
        f"--screenshot={out_file}",
        f"--window-size={item['size']}",
        f"--virtual-time-budget={int(item['delay'] * 1000)}",
        item["url"]
    ]
    print(f"Capturing {item['filename']} from {item['url']}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_file) and os.path.getsize(out_file) > 1000:
        print(f"  [OK] Saved {item['filename']} ({os.path.getsize(out_file):,} bytes)")
    else:
        print(f"  [WARN] Failed or empty: {item['filename']}. Stderr: {res.stderr}")

print("Screenshot capture process finished!")
