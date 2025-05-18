# Node.js v18 專用安裝腳本
# 設定顏色
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$RED = [System.ConsoleColor]::Red
$CYAN = [System.ConsoleColor]::Cyan

Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host "  Node.js v18 專用套件安裝腳本  " -ForegroundColor $GREEN
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host ""

# 檢查 Node.js 版本
try {
    $nodeVersion = node -v
    Write-Host "檢測到 Node.js 版本: $nodeVersion" -ForegroundColor $YELLOW
    
    # 檢查是否為 v18.x.x
    if (-not ($nodeVersion -match "v18")) {
        Write-Host "警告: 您使用的不是 Node.js v18。建議使用 Node.js v18 以獲得最佳相容性。" -ForegroundColor $RED
        $continue = Read-Host "是否繼續安裝? (y/n)"
        if ($continue -ne "y") {
            Write-Host "安裝已取消。請先執行 install-node18.ps1 安裝 Node.js v18。" -ForegroundColor $RED
            exit
        }
    } else {
        Write-Host "確認您使用的是 Node.js v18，適合 Next.js 13.5.4。" -ForegroundColor $GREEN
    }
} catch {
    Write-Host "無法檢測 Node.js 版本。請確保 Node.js 已正確安裝。" -ForegroundColor $RED
    exit
}

# 設置專案路徑
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $PROJECT_ROOT

# 清理現有的 node_modules 和 package-lock.json
Write-Host "1. 清理現有安裝..." -ForegroundColor $CYAN

# 強制刪除 node_modules
if (Test-Path -Path "node_modules") {
    Write-Host "   移除 node_modules 資料夾..." -ForegroundColor $YELLOW
    cmd /c "rmdir /s /q node_modules"
    Start-Sleep -Seconds 1
}

# 刪除 package-lock.json
if (Test-Path -Path "package-lock.json") {
    Write-Host "   移除 package-lock.json..." -ForegroundColor $YELLOW
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
}

# 刪除其他可能影響安裝的檔案
$filesToRemove = @(".next", ".npm", "npm-debug.log", "yarn-error.log")
foreach ($file in $filesToRemove) {
    if (Test-Path -Path $file) {
        Write-Host "   移除 $file..." -ForegroundColor $YELLOW
        if (Test-Path -Path $file -PathType Container) {
            Remove-Item -Recurse -Force $file -ErrorAction SilentlyContinue
        } else {
            Remove-Item -Force $file -ErrorAction SilentlyContinue
        }
    }
}

# 清理 npm 快取
Write-Host "2. 清理 npm 快取..." -ForegroundColor $CYAN
npm cache clean --force

# 安裝核心套件 (使用 --legacy-peer-deps 而非 --force，在 Node.js v18 環境下更合適)
Write-Host "3. 安裝核心套件 (React 和 Next.js)..." -ForegroundColor $CYAN
npm i next@13.5.4 react@18.2.0 react-dom@18.2.0 --legacy-peer-deps --no-fund

# 如果核心安裝失敗，嘗試使用 --force
if ($LASTEXITCODE -ne 0) {
    Write-Host "   使用 --legacy-peer-deps 安裝失敗，嘗試使用 --force..." -ForegroundColor $RED
    npm i next@13.5.4 react@18.2.0 react-dom@18.2.0 --force --no-fund
}

# 安裝 UI 相關套件
Write-Host "4. 安裝 UI 套件 (@radix-ui)..." -ForegroundColor $CYAN
$uiPackages = @(
    "@radix-ui/react-accordion@^1.2.3",
    "@radix-ui/react-alert-dialog@^1.1.6",
    "@radix-ui/react-avatar@^1.1.3", 
    "@radix-ui/react-checkbox@^1.1.4",
    "@radix-ui/react-dialog@^1.1.6",
    "@radix-ui/react-dropdown-menu@^2.1.6",
    "@radix-ui/react-label@^2.1.2"
)
npm i $uiPackages --legacy-peer-deps --no-fund

$uiPackages2 = @(
    "@radix-ui/react-menubar@^1.1.6",
    "@radix-ui/react-popover@^1.1.6",
    "@radix-ui/react-progress@^1.1.2",
    "@radix-ui/react-radio-group@^1.2.3",
    "@radix-ui/react-scroll-area@^1.2.3",
    "@radix-ui/react-select@^2.1.6",
    "@radix-ui/react-separator@^1.1.2"
)
npm i $uiPackages2 --legacy-peer-deps --no-fund

$uiPackages3 = @(
    "@radix-ui/react-slider@^1.2.3",
    "@radix-ui/react-slot@^1.1.2",
    "@radix-ui/react-switch@^1.1.3",
    "@radix-ui/react-tabs@^1.1.3",
    "@radix-ui/react-toast@^1.2.6",
    "@radix-ui/react-tooltip@^1.1.8"
)
npm i $uiPackages3 --legacy-peer-deps --no-fund

# 安裝功能性套件
Write-Host "5. 安裝功能套件..." -ForegroundColor $CYAN
$funcPackages = @(
    "@hookform/resolvers@^4.1.3",
    "@tanstack/react-query@^5.66.0",
    "class-variance-authority@^0.7.1", 
    "clsx@^2.1.1", 
    "date-fns@^3.6.0"
)
npm i $funcPackages --legacy-peer-deps --no-fund

$funcPackages2 = @(
    "lucide-react@^0.475.0",
    "react-day-picker@^8.10.1",
    "react-hook-form@^7.54.2", 
    "recharts@^2.15.1", 
    "tailwind-merge@^3.0.1", 
    "tailwindcss-animate@^1.0.7", 
    "zod@^3.24.2"
)
npm i $funcPackages2 --legacy-peer-deps --no-fund

# 安裝開發依賴項
Write-Host "6. 安裝開發依賴項..." -ForegroundColor $CYAN
$devPackages = @(
    "@types/node@^20",
    "@types/react@^18",
    "@types/react-dom@^18",
    "postcss@^8",
    "tailwindcss@^3.4.1",
    "typescript@^5"
)
npm i $devPackages --save-dev --legacy-peer-deps --no-fund

# 檢查安裝結果
Write-Host "7. 檢查安裝結果..." -ForegroundColor $CYAN
if (Test-Path -Path "node_modules\next") {
    $folderCount = (Get-ChildItem -Directory -Path "node_modules").Count
    Write-Host "已成功安裝 $folderCount 個套件！Next.js 已安裝。" -ForegroundColor $GREEN
    
    # 建立 .env 檔案 (如果不存在)
    if (-not (Test-Path ".env")) {
        Write-Host "8. 建立 .env 檔案..." -ForegroundColor $CYAN
        @"
# 本地開發環境設定
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
"@ | Out-File -FilePath ".env" -Encoding utf8
        Write-Host "   .env 檔案已建立。" -ForegroundColor $GREEN
    }
    
    Write-Host "安裝完成！您現在可以執行以下指令啟動應用程式:" -ForegroundColor $GREEN
    Write-Host "npm run dev" -ForegroundColor $CYAN
} else {
    Write-Host "安裝可能不完整。未找到 Next.js。" -ForegroundColor $RED
    Write-Host "請嘗試手動執行以下指令:" -ForegroundColor $YELLOW
    Write-Host "npm i next@13.5.4 --legacy-peer-deps" -ForegroundColor $CYAN
}
