@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting MediAccess Full-Stack Application...
echo ========================================================
start "MediAccess Backend (FastAPI)" /d "%~dp0" cmd /k "call start_backend.bat"
start "MediAccess Frontend (Vite)" /d "%~dp0" cmd /k "call start_frontend.bat"
echo Both servers launched in separate windows!
echo Web App: http://localhost:5173
echo API Docs: http://127.0.0.1:8000/docs
