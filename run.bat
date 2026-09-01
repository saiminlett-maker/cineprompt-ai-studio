@echo off
title AI Video Prompt Master
echo ===================================================
echo     Launching AI Video Prompt Master...
echo ===================================================
cd /d "%~dp0"

where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Starting with local web server...
    python server.py
) else (
    echo Python not found. Opening index.html directly in your browser...
    start index.html
)
