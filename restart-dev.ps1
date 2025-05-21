$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "清理 Next.js 快取..."
Remove-Item -Path "$PROJECT_ROOT\.next" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "正在重建前端資源..."
Set-Location -Path $PROJECT_ROOT
npm run build

Write-Host "啟動前端開發伺服器..."
npm run dev
