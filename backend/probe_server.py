import subprocess
import time
import urllib.request
import json
import sys

def probe():
    print("Starting Uvicorn server on http://127.0.0.1:8000...")
    proc = subprocess.Popen([
        sys.executable, "-m", "uvicorn", "backend.app.main:app",
        "--host", "127.0.0.1", "--port", "8000"
    ])

    time.sleep(3)

    try:
        req = urllib.request.urlopen("http://127.0.0.1:8000/")
        data = json.loads(req.read().decode("utf-8"))
        print("✓ Server replied successfully with 200 OK:")
        print(json.dumps(data, indent=2))
        return True
    except Exception as e:
        print(f"✗ Failed to reach server: {e}")
        return False
    finally:
        proc.terminate()
        proc.wait()
        print("Server process shut down cleanly.")

if __name__ == "__main__":
    success = probe()
    sys.exit(0 if success else 1)
