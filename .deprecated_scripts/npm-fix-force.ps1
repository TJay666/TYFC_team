# npm 強制安裝腳本
# 設定顏色常量
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red

# 顯示歡迎訊息
Clear-Host
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host "  npm 強制安裝工具 - 桃園獵鷹管理平台  " -ForegroundColor $GREEN
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host ""

# 設置專案路徑
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# 檢查 Node.js 版本
$nodeVersion = node -v
Write-Host "檢測到 Node.js 版本: $nodeVersion" -ForegroundColor $YELLOW
Write-Host "注意：Next.js 13.5.4 對較新版本的 Node.js 可能存在相容性問題" -ForegroundColor $YELLOW
Write-Host ""

# 確保使用者在繼續前得到警告
$continue = Read-Host "此腳本將清理現有的 node_modules 並使用 --force 選項強制重新安裝依賴項。繼續? (y/n)"
if ($continue -ne "y") {
    Write-Host "取消操作。" -ForegroundColor $RED
    exit
}

# 設置工作目錄
Set-Location -Path $PROJECT_ROOT

# 清理現有安裝
Write-Host "Step 1: 清理現有安裝..." -ForegroundColor $CYAN

# 關閉可能在運行的 node 進程
Write-Host "  嘗試關閉所有 Node.js 進程..." -ForegroundColor $YELLOW
taskkill /f /im node.exe 2>$null
# 忽略錯誤，因為可能沒有 node 進程在運行

# 強制刪除 node_modules 目錄
if (Test-Path -Path "node_modules") {
    Write-Host "  移除 node_modules 資料夾..." -ForegroundColor $YELLOW
    try {
        Remove-Item -Recurse -Force -Path "node_modules" -ErrorAction Stop
        Write-Host "  成功刪除 node_modules" -ForegroundColor $GREEN
    }
    catch {
        Write-Host "  使用標準方法無法刪除 node_modules，嘗試使用系統命令..." -ForegroundColor $RED
        cmd /c "rmdir /s /q node_modules"
        
        # 檢查是否還存在
        if (Test-Path -Path "node_modules") {
            Write-Host "  警告：無法完全刪除 node_modules 資料夾" -ForegroundColor $RED
            Write-Host "  將嘗試繼續安裝..." -ForegroundColor $YELLOW
        }
    }
}

# 刪除 npm 快取
Write-Host "  清理 npm 快取..." -ForegroundColor $YELLOW
npm cache clean --force

# 刪除 package-lock.json
if (Test-Path -Path "package-lock.json") {
    Write-Host "  刪除 package-lock.json..." -ForegroundColor $YELLOW
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
}

# 刪除 .next 資料夾 (如果存在)
if (Test-Path -Path ".next") {
    Write-Host "  刪除 .next 資料夾..." -ForegroundColor $YELLOW
    Remove-Item -Recurse -Force ".next" -ErrorAction SilentlyContinue
}

# Step 2: 先安裝核心依賴項
Write-Host "Step 2: 安裝核心依賴項..." -ForegroundColor $CYAN
Write-Host "  使用 --force 選項安裝 Next.js 和 React..." -ForegroundColor $YELLOW
npm i next@13.5.4 react@18.2.0 react-dom@18.2.0 --force --no-fund --no-audit

# Step 3: 使用 --force 強制安裝所有依賴項
Write-Host "Step 3: 使用 --force 選項安裝所有依賴項..." -ForegroundColor $CYAN
Write-Host "  這可能需要幾分鐘時間..." -ForegroundColor $YELLOW
npm i --force --no-fund --no-audit

# 檢查安裝結果
Write-Host "檢查安裝結果..." -ForegroundColor $CYAN
$nodeModulesExists = Test-Path -Path "node_modules"

if ($nodeModulesExists) {
    $nextExists = Test-Path -Path "node_modules\next\dist\bin\next"
    if ($nextExists) {
        Write-Host "✅ Next.js 安裝成功！" -ForegroundColor $GREEN
    }
    else {
        Write-Host "❌ Next.js 安裝似乎失敗，找不到核心文件。" -ForegroundColor $RED
    }
    
    $folders = Get-ChildItem -Path "node_modules" -Directory
    $count = $folders.Count
    Write-Host "在 node_modules 中發現 $count 個套件。" -ForegroundColor $CYAN
    
    if ($count -lt 10) {
        Write-Host "❌ 安裝不完整，套件數量過少。" -ForegroundColor $RED
    } else {
        Write-Host "✅ 安裝完成！" -ForegroundColor $GREEN
    }
} else {
    Write-Host "❌ 安裝失敗。找不到 node_modules 資料夾。" -ForegroundColor $RED
}

Write-Host ""
Write-Host "嘗試啟動應用程式:" -ForegroundColor $GREEN
Write-Host "  npm run dev" -ForegroundColor $CYAN
