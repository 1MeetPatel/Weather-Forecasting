@echo off
echo =========================================
echo    Starting Weather Application
echo =========================================
echo.

echo [+] Starting Python API Backend on port 5000...
start "Weather API Backend" cmd /k "python app.py"

echo [+] Starting React Frontend on port 3000...
start "Weather App Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo Once the Vite server is ready, open your browser and navigate to:
echo http://localhost:3000
echo.
pause
