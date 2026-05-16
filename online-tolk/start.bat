@echo off
title Online Tolk
cd /d "%~dp0"

echo ==================================================
echo   Online Tolk starten
echo ==================================================
echo.
echo Er openen twee vensters: de backend en de frontend.
echo De eerste keer duurt het opstarten enkele minuten,
echo omdat pakketten en taalmodellen gedownload worden.
echo.

start "Online Tolk - backend" "%~dp0backend\start-backend.bat"
start "Online Tolk - frontend" "%~dp0frontend\start-frontend.bat"

echo Wacht tot het FRONTEND-venster "Ready" toont en het
echo BACKEND-venster "Tolk-dienst luistert op poort 8765".
echo.
echo Open daarna in Chrome of Edge:
echo.
echo     http://localhost:3000
echo.
echo Laat beide vensters openstaan tijdens het gebruik.
echo.
pause
