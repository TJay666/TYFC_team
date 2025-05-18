# 一次性強制安裝腳本
Write-Host "開始清理和重新安裝前端套件 (強制模式)..." -ForegroundColor Cyan

# 關閉 Node 進程
taskkill /f /im node.exe 2>$null

# 刪除舊文件
cmd /c "rmdir /s /q node_modules" 2>$null
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 清理 npm 快取
npm cache clean --force

# 使用 --force 安裝 - 先安裝核心套件
npm i next@13.5.4 react@18.2.0 react-dom@18.2.0 --force --no-fund --no-audit

# 使用 --force 安裝所有套件
npm i --force --no-fund --no-audit

Write-Host ""
Write-Host "安裝完成。請嘗試運行 npm run dev" -ForegroundColor Green
