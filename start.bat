@echo off
title ArchSense - Evaluator Console
echo =====================================================================
echo    ArchSense: Autonomous Architecture Governance & PR Boundary Audit
echo    Meta Global AI Developer Hackathon 2026
echo =====================================================================
echo.
echo [1/2] Verifying frontend environment...
cd /d "%~dp0frontend"
if not exist node_modules (
    echo [i] First time launch: Installing dependencies...
    call npm install
)
echo.
echo [2/2] Starting Next.js Evaluator Console on http://localhost:3000...
echo.
call npm run dev
pause
