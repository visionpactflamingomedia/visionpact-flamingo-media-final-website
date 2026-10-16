@echo off
cd /d "%~dp0"
title Visionpact website preview

where node >nul 2>nul
if errorlevel 1 (
 echo Node.js is not installed. Install Node.js 22.13 or newer from https://nodejs.org and run this file again.
 pause
 exit /b 1
)

node -e "const [a,b]=process.versions.node.split('.').map(Number);process.exit(a>22||(a===22&&b>=13)?0:1)"
if errorlevel 1 (
 echo Your Node.js version is too old for this website.
 node -v
 echo Install Node.js 22.13 or newer from https://nodejs.org and run this file again.
 pause
 exit /b 1
)

if not exist "node_modules\vinext" (
 echo First run in this folder: installing dependencies. This can take a few minutes...
 call npm ci
 if errorlevel 1 (
  echo.
  echo Installing dependencies failed. Check your internet connection and run this file again.
  pause
  exit /b 1
 )
)

echo.
echo Website preview: http://localhost:5173/
echo If an older copy of the website is still running, close that window first.
echo Keep this window open while viewing the website.
node scripts/run-framework.mjs dev
pause
