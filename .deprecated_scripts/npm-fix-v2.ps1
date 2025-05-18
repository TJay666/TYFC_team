# 解決 npm 安裝問題的腳本 (修復版)
# 設定顏色常量
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red

# 顯示歡迎訊息
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host "  npm 問題修復工具 - 桃園獵鷹管理平台  " -ForegroundColor $GREEN
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host ""

# 設置專案路徑
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# 檢查 Node.js 版本
$nodeVersion = node -v
Write-Host "檢測到 Node.js 版本: $nodeVersion" -ForegroundColor $YELLOW

# 確保使用者在繼續前得到警告
$continue = Read-Host "此腳本將清理現有的 node_modules 並重新安裝依賴項。繼續? (y/n)"
if ($continue -ne "y") {
    Write-Host "取消操作。" -ForegroundColor $RED
    exit
}

# 設置工作目錄
Set-Location -Path $PROJECT_ROOT

# 清理現有安裝
Write-Host "Step 1: 清理現有安裝..." -ForegroundColor $CYAN

# 強制刪除 node_modules (使用可選的強制選項)
if (Test-Path -Path "node_modules") {
    Write-Host "  移除 node_modules 資料夾..." -ForegroundColor $YELLOW
    Remove-Item -Recurse -Force -Path "node_modules" -ErrorAction SilentlyContinue
    
    # 檢查是否成功刪除
    if (Test-Path -Path "node_modules") {
        Write-Host "  無法刪除 node_modules 資料夾。可能被其他程序鎖定。" -ForegroundColor $RED
        Write-Host "  請關閉所有 Node.js 相關程序並重試。" -ForegroundColor $RED
        
        $forceDelete = Read-Host "要嘗試使用系統命令強制刪除嗎? (y/n)"
        if ($forceDelete -eq "y") {
            # 使用系統命令強制刪除
            Write-Host "  使用系統命令強制刪除..." -ForegroundColor $YELLOW
            cmd /c "rmdir /s /q node_modules"
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

# 創建 next.config.js 文件 (如果不存在)
if (-not (Test-Path -Path "next.config.js")) {
    Write-Host "創建 next.config.js 檔案..." -ForegroundColor $CYAN
    
    $nextConfigContent = @"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
"@

    Set-Content -Path "next.config.js" -Value $nextConfigContent -Force
    Write-Host "  next.config.js 檔案已建立。" -ForegroundColor $GREEN
}

# Step 2: 安裝核心依賴項
Write-Host "Step 2: 安裝核心依賴項..." -ForegroundColor $CYAN
Write-Host "  安裝 Next.js 和 React..." -ForegroundColor $YELLOW
npm install next@13.5.4 react@18.2.0 react-dom@18.2.0 --no-fund --no-audit --legacy-peer-deps

# Step 3: 安裝其他依賴項
Write-Host "Step 3: 安裝剩餘依賴項..." -ForegroundColor $CYAN
Write-Host "  安裝所有依賴項..." -ForegroundColor $YELLOW
npm install --legacy-peer-deps --no-fund --no-audit

# 檢查安裝結果
Write-Host "檢查安裝結果..." -ForegroundColor $CYAN
$nodeModulesExists = Test-Path -Path "node_modules"
if ($nodeModulesExists) {
    $folders = Get-ChildItem -Path "node_modules" -Directory
    $count = $folders.Count
    Write-Host "在 node_modules 中發現 $count 個套件。" -ForegroundColor $GREEN
    if ($count -lt 10) {
        Write-Host "安裝似乎不完整，套件數量很少。" -ForegroundColor $RED
    } else {
        Write-Host "安裝完成！" -ForegroundColor $GREEN
    }
} else {
    Write-Host "安裝可能失敗。找不到 node_modules 資料夾。" -ForegroundColor $RED
}

Write-Host ""
Write-Host "現在可以嘗試啟動應用程式:" -ForegroundColor $GREEN
Write-Host "  npm run dev" -ForegroundColor $CYAN
