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
echo Waiting for the frontend server to spin up...
timeout /t 5 /nobreak >nul

echo Opening your browser...
start http://localhost:3000
echo.
pause
