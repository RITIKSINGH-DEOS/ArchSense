@echo off
title ArchSense - Fullstack Autonomous Governance Studio
echo =====================================================================
echo    ArchSense: Autonomous Architecture Governance & PR Boundary Audit
echo    Meta Global AI Developer Hackathon 2026
echo =====================================================================
echo.

echo [1/3] Starting FastAPI Governance Core on http://localhost:8000...
start "ArchSense Backend (FastAPI)" cmd /c "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/3] Verifying Next.js frontend dependencies...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo [i] First time launch: Installing npm dependencies...
    call npm install
)

echo.
echo [3/3] Starting Next.js Evaluator Console on http://localhost:3000...
echo.
call npm run dev
pause
