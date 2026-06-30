@echo off
title SPLAY - Skylight Visualizer
cd /d "%~dp0"

echo ==================================================
echo    SPLAY - Skylight Placement Visualizer
echo ==================================================
echo.

REM --- Check that Node.js is installed -------------------------------
where node >nul 2>nul
if errorlevel 1 (
    echo [PROBLEM] Node.js is not installed on this computer.
    echo.
    echo   1. Go to https://nodejs.org
    echo   2. Download the version marked "LTS" and install it
    echo      ^(just click Next / Next / Finish^).
    echo   3. Double-click this file again.
    echo.
    pause
    exit /b 1
)

REM --- First-time setup: install dependencies ------------------------
if not exist "node_modules\" (
    echo First-time setup: downloading the parts the app needs.
    echo This happens only once and can take a minute or two.
    echo Please wait...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [PROBLEM] Setup did not finish. Check your internet connection
        echo           and double-click this file again.
        echo.
        pause
        exit /b 1
    )
)

echo.
echo Starting SPLAY... a web browser window will open in a few seconds.
echo.
echo   ^>^>  To STOP the app later: just close this black window.
echo.

REM --- Launch the app and open the browser ---------------------------
call npm run dev -- --open

REM If the app stops or errors, keep the window open so the message is readable.
echo.
echo The app has stopped. You can close this window.
pause
