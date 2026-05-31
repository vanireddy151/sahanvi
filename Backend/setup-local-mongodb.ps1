$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "Starting MongoDB with Docker..."
docker compose up -d

Write-Host "Creating database collections and indexes..."
npm.cmd run setup:db

Write-Host "Creating admin users..."
npm.cmd run seed:admins

Write-Host ""
Write-Host "MongoDB setup complete. Start the backend with:"
Write-Host "npm.cmd start"
