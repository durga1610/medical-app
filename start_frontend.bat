@echo off
cd /d "%~dp0frontend"
echo ========================================================
echo Starting MediAccess React Vite Frontend...
echo Web App will be available at: http://localhost:5173
echo ========================================================
call npm run dev -- --host 127.0.0.1 --port 5173
pause
