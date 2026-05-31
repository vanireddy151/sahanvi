@echo off
cd /d "%~dp0"
docker compose up -d
npm.cmd run setup:db
npm.cmd run seed:admins
echo.
echo MongoDB setup complete. Start the backend with:
echo npm.cmd start
pause
