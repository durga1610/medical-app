import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_path = os.path.abspath(r"report_assets\home_screen.png")
profile_dir = os.path.abspath(r"report_assets\chrome_profile")

cmd = [
    chrome_path,
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    f"--user-data-dir={profile_dir}",
    f"--screenshot={out_path}",
    "--window-size=1280,900",
    "http://localhost:5173"
]

print("Running command:", " ".join(cmd))
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)
print("Stdout:", res.stdout)
print("Stderr:", res.stderr)
print("File exists:", os.path.exists(out_path))
if os.path.exists(out_path):
    print("File size:", os.path.getsize(out_path))
