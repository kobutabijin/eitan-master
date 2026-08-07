@echo off
cd /d "%~dp0"

if not exist node_modules (
  echo Installing required packages...
  call npm.cmd ci
  if errorlevel 1 goto :error
)

echo Checking the bundled Chromium browser...
node scripts\check-browser.js
if errorlevel 1 (
  echo Installing Chromium for first use...
  call npm.cmd run browser:install
  if errorlevel 1 goto :error
)

echo Starting Eitan Master. Please wait for the browser window...
call npm.cmd run app
if errorlevel 1 goto :error
exit /b 0

:error
echo.
echo Startup failed. Review the error messages above.
pause
exit /b 1
