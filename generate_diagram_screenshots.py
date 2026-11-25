import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
assets_dir = os.path.abspath(r"report_assets")
profile_dir = os.path.join(assets_dir, "chrome_profile")

# 1. Figure 3.1: System Architecture
html_arch = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; margin: 0; padding: 25px; display: flex; justify-content: center; }
  .canvas { width: 950px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-sizing: border-box; }
  .title { font-size: 20px; font-weight: 700; color: #12304A; text-align: center; margin-bottom: 25px; }
  .grid { display: grid; grid-template-columns: 280px 380px 220px; gap: 20px; }
  .col { display: flex; flex-direction: column; gap: 15px; }
  .col-header { font-size: 15px; font-weight: 700; color: #0F9D91; text-align: center; padding-bottom: 8px; border-bottom: 2px solid #0F9D91; }
  .card { background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 14px 16px; text-align: center; font-size: 13px; font-weight: 600; color: #1e293b; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
  .card-client { border-color: #0F9D91; background: #f0fdfa; color: #0d9488; }
  .card-server { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }
  .card-ext { border-color: #64748b; background: #f1f5f9; color: #334155; }
  .card small { display: block; font-size: 11px; font-weight: normal; color: #64748b; margin-top: 4px; }
  .arrow { text-align: center; font-size: 18px; color: #94a3b8; margin: -5px 0; }
</style>
</head>
<body>
<div class="canvas">
  <div class="title">MediAccess Full-Stack System Architecture</div>
  <div class="grid">
    <div class="col">
      <div class="col-header">Mobile / Web Client (React 19)</div>
      <div class="card card-client">1. Strip Scanner UI<small>Camera capture, Canvas preprocessor</small></div>
      <div class="card card-client">2. Medicine Search & Catalog<small>26 medicines, category filters</small></div>
      <div class="card card-client">3. Pharmacy Locator & Map<small>Haversine distance calculation</small></div>
      <div class="card card-client">4. Cart & Order Tracking<small>5-stage visual delivery tracker</small></div>
      <div class="card card-client">5. Pharmacy & Courier Portals<small>Inventory updates & job marketplace</small></div>
    </div>
    <div class="col">
      <div class="col-header">Application Server (FastAPI / Python)</div>
      <div class="card card-server">OCR Text Recognition Engine<small>Tesseract.js client worker + regex rules</small></div>
      <div class="card card-server">Medicine Normalizer & Fuzzy Matcher<small>Tokenized catalog matching & confidence scoring</small></div>
      <div class="card card-server">Inventory & Pharmacy Service<small>Multi-tenant stock & price management</small></div>
      <div class="card card-server">Reservation & Order Engine<small>Pickup booking, stock decrement, cancellation</small></div>
      <div class="card card-server">Delivery Dispatch & Earnings Ledger<small>Atomic job claiming, GPS status advancement</small></div>
    </div>
    <div class="col">
      <div class="col-header">Data & External Services</div>
      <div class="card card-ext">SQLite Database<small>mediaccess.db (Persistent storage)</small></div>
      <div class="card card-ext">Firebase Web SDK<small>Project: medical-access-1f08e</small></div>
      <div class="card card-ext">Browser Geolocation API<small>W3C GPS latitude / longitude</small></div>
      <div class="card card-ext">GitHub Remote Repo<small>durga1610/medical-app.git</small></div>
    </div>
  </div>
</div>
</body>
</html>
"""

# 2. Figure 3.2: Process Flow
html_flow = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; margin: 0; padding: 25px; display: flex; justify-content: center; }
  .canvas { width: 680px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-sizing: border-box; }
  .title { font-size: 20px; font-weight: 700; color: #12304A; text-align: center; margin-bottom: 25px; }
  .flow { display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .node { width: 440px; background: #f0fdfa; border: 1.5px solid #0F9D91; border-radius: 10px; padding: 10px 16px; text-align: center; font-size: 13px; font-weight: 600; color: #0f766e; }
  .node-blue { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
  .node-purple { background: #faf5ff; border-color: #a855f7; color: #7e22ce; }
  .node-amber { background: #fffbeb; border-color: #f59e0b; color: #b45309; }
  .node-green { background: #f0fdf4; border-color: #22c55e; color: #15803d; }
  .arrow { color: #64748b; font-size: 14px; font-weight: bold; }
</style>
</head>
<body>
<div class="canvas">
  <div class="title">MediAccess End-to-End 3-Phase Process Flow</div>
  <div class="flow">
    <div class="node">User Authentication & Profile Setup (Phase 1)</div>
    <div class="arrow">▼</div>
    <div class="node">Medicine Strip Scanning (Tesseract.js OCR) or Search</div>
    <div class="arrow">▼</div>
    <div class="node">Medicine Identification & Verification (Confidence Score %)</div>
    <div class="arrow">▼</div>
    <div class="node node-blue">Locate Nearby Pharmacies (Haversine Distance & Stock)</div>
    <div class="arrow">▼</div>
    <div class="node node-blue">Fulfillment Selection: Reserve & Collect vs Home Delivery</div>
    <div class="arrow">▼</div>
    <div class="node node-purple">Phase 2: Pharmacy Receives Order & Updates Inventory</div>
    <div class="arrow">▼</div>
    <div class="node node-purple">Pharmacy Packages Order & Marks "Ready for Delivery"</div>
    <div class="arrow">▼</div>
    <div class="node node-amber">Phase 3: Delivery Driver Claims Job & Confirms Pickup</div>
    <div class="arrow">▼</div>
    <div class="node node-green">Live Doorstep Handover & 5-Stage Customer Tracking Verified</div>
  </div>
</div>
</body>
</html>
"""

# 3. Figure 4.6: Project Schedule (Gantt Chart)
html_gantt = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  body { font-family: 'Segoe UI', Arial, sans-serif; background: #ffffff; margin: 0; padding: 25px; display: flex; justify-content: center; }
  .canvas { width: 920px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 30px; box-sizing: border-box; }
  .title { font-size: 20px; font-weight: 700; color: #12304A; text-align: center; margin-bottom: 25px; }
  table { width: 100%; border-collapse: collapse; font-size: 12px; }
  th, td { border: 1px solid #cbd5e1; padding: 8px 10px; text-align: left; }
  th { background: #f1f5f9; color: #1e293b; font-weight: 700; }
  .bar { height: 16px; border-radius: 4px; background: #0F9D91; }
  .bar-blue { background: #3b82f6; }
  .bar-amber { background: #f59e0b; }
  .bar-purple { background: #8b5cf6; }
</style>
</head>
<body>
<div class="canvas">
  <div class="title">Project Schedule (12-Week Agile Sprint Timeline)</div>
  <table>
    <thead>
      <tr>
        <th style="width: 260px;">Project Activity / Milestone</th>
        <th>W1</th><th>W2</th><th>W3</th><th>W4</th><th>W5</th><th>W6</th><th>W7</th><th>W8</th><th>W9</th><th>W10</th><th>W11</th><th>W12</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Problem Definition & Healthcare Literature Survey</td><td colspan="2"><div class="bar"></div></td><td colspan="10"></td></tr>
      <tr><td>Requirements Specification & ISO 25010 Quality Model</td><td></td><td colspan="2"><div class="bar"></div></td><td colspan="9"></td></tr>
      <tr><td>Database Architecture & SQLite Schema Design</td><td colspan="2"></td><td colspan="2"><div class="bar"></div></td><td colspan="8"></td></tr>
      <tr><td>FastAPI Backend Development & REST APIs</td><td colspan="3"></td><td colspan="3"><div class="bar bar-blue"></div></td><td colspan="6"></td></tr>
      <tr><td>React UI Development & Tailwind Styling</td><td colspan="4"></td><td colspan="3"><div class="bar bar-blue"></div></td><td colspan="5"></td></tr>
      <tr><td>Tesseract.js OCR Strip Scanning Implementation</td><td colspan="5"></td><td colspan="3"><div class="bar bar-amber"></div></td><td colspan="4"></td></tr>
      <tr><td>Phase 2: Pharmacy Store Dashboard Integration</td><td colspan="6"></td><td colspan="2"><div class="bar bar-amber"></div></td><td colspan="4"></td></tr>
      <tr><td>Phase 3: Delivery Fleet Partner Marketplace</td><td colspan="7"></td><td colspan="2"><div class="bar bar-purple"></div></td><td colspan="3"></td></tr>
      <tr><td>Direct Integration Test Suite & Bug Fixing</td><td colspan="8"></td><td colspan="2"><div class="bar bar-purple"></div></td><td colspan="2"></td></tr>
      <tr><td>GitHub Version Control & Final Documentation</td><td colspan="10"></td><td colspan="2"><div class="bar"></div></td></tr>
    </tbody>
  </table>
</div>
</body>
</html>
"""

files_to_render = [
    ("fig_3_1_architecture.html", html_arch, "fig_3_1_architecture.png", "1000,600"),
    ("fig_3_2_process_flow.html", html_flow, "fig_3_2_process_flow.png", "740,650"),
    ("fig_4_6_gantt_chart.html", html_gantt, "fig_4_6_gantt_chart.png", "980,500"),
]

for html_name, html_content, png_name, win_size in files_to_render:
    h_path = os.path.join(assets_dir, html_name)
    p_path = os.path.join(assets_dir, png_name)
    with open(h_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    cmd = [
        chrome_path,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        f"--user-data-dir={profile_dir}",
        f"--screenshot={p_path}",
        f"--window-size={win_size}",
        f"file:///{h_path.replace(os.sep, '/')}"
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(p_path) and os.path.getsize(p_path) > 1000:
        print(f"[OK] Generated {png_name} ({os.path.getsize(p_path):,} bytes)")
    else:
        print(f"[WARN] Failed to generate {png_name}: {res.stderr}")

print("Diagram generation finished!")
