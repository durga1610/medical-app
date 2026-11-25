@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting MediAccess FastAPI Backend Server...
echo API Docs will be available at: http://127.0.0.1:8000/docs
echo ========================================================
".\venv\Scripts\python.exe" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause
