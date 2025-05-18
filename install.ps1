# 桃園獵鷹管理平台 - 一鍵安裝腳本
# Setting color constants
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red
$MAGENTA = [System.ConsoleColor]::Magenta

# 顯示歡迎訊息
Clear-Host
Write-Host "============================================" -ForegroundColor $MAGENTA
Write-Host "    桃園獵鷹宇宙管理平台 - 一鍵安裝腳本    " -ForegroundColor $MAGENTA
Write-Host "============================================" -ForegroundColor $MAGENTA
Write-Host ""

# 設置專案路徑
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path -Path $PROJECT_ROOT -ChildPath "backend"
$FRONTEND_DIR = $PROJECT_ROOT

# 顯示系統資訊
Write-Host "系統資訊:" -ForegroundColor $CYAN
$nodeInstalled = $false
$pythonInstalled = $false

# 檢查 Node.js
try {
    $nodeVersion = node -v
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor $GREEN
    $nodeInstalled = $true
} catch {
    Write-Host "✗ Node.js: 未安裝" -ForegroundColor $RED
}

# 檢查 Python
try {
    $pythonVersion = python --version
    Write-Host "✓ Python: $pythonVersion" -ForegroundColor $GREEN
    $pythonInstalled = $true
} catch {
    Write-Host "✗ Python: 未安裝" -ForegroundColor $RED
}

# 檢查 npm
if ($nodeInstalled) {
    try {
        $npmVersion = npm -v
        Write-Host "✓ npm: $npmVersion" -ForegroundColor $GREEN
    } catch {
        Write-Host "✗ npm: 未安裝或無法啟動" -ForegroundColor $RED
        $nodeInstalled = $false
    }
}

# 檢查 pip
if ($pythonInstalled) {
    try {
        $pipVersion = pip --version
        Write-Host "✓ pip: $pipVersion" -ForegroundColor $GREEN
    } catch {
        Write-Host "✗ pip: 未安裝或無法啟動" -ForegroundColor $RED
        $pythonInstalled = $false
    }
}

Write-Host ""
# 選擇要設置的部分
Write-Host "請選擇要安裝的部分:" -ForegroundColor $CYAN
Write-Host "1. 前端 (Next.js)" -ForegroundColor $CYAN
Write-Host "2. 後端 (Django)" -ForegroundColor $CYAN
Write-Host "3. 兩者皆安裝" -ForegroundColor $CYAN
Write-Host "4. 只檢查環境並自動修復" -ForegroundColor $CYAN
Write-Host "0. 退出" -ForegroundColor $CYAN
$choice = Read-Host "請輸入選項"

# 自動檢查環境並修復
function Check-And-Fix-Environment {
    Write-Host "正在檢查環境..." -ForegroundColor $YELLOW
    $issues = @()
    
    # 檢查前端問題
    if (Test-Path -Path "$PROJECT_ROOT\node_modules") {
        $nodeModulesSize = (Get-ChildItem "$PROJECT_ROOT\node_modules" -Recurse | Measure-Object -Property Length -Sum).Sum
        if ($nodeModulesSize -lt 10000000) {  # 小於10MB可能表示安裝不完整
            $issues += "前端依賴項安裝不完整"
        }
    } else {
        $issues += "未安裝前端依賴項"
    }
    
    # 檢查後端問題
    $venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
    if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
        $issues += "未創建後端虛擬環境"
    }
    
    # 檢查 .env 文件
    if (-not (Test-Path -Path "$PROJECT_ROOT\.env")) {
        $issues += "缺少 .env 檔案"
    }
    
    # 檢查 API 設定
    if (Test-Path -Path "$PROJECT_ROOT\src\lib\auth-api.ts") {
        $authApiContent = Get-Content -Path "$PROJECT_ROOT\src\lib\auth-api.ts" -Raw
        if ($authApiContent -match "https://") {
            $issues += "API URL 仍設定為遠程伺服器，不是本地開發環境"
        }
    }
    
    # 顯示檢測結果
    if ($issues.Count -eq 0) {
        Write-Host "✓ 未檢測到問題，環境設置正確！" -ForegroundColor $GREEN
        return $false
    } else {
        Write-Host "檢測到以下問題:" -ForegroundColor $YELLOW
        foreach ($issue in $issues) {
            Write-Host "  - $issue" -ForegroundColor $RED
        }
        Write-Host ""
        Write-Host "建議執行自動修復程序" -ForegroundColor $YELLOW
        $repair = Read-Host "是否執行修復? (y/n)"
        return ($repair -eq "y")
    }
}

# 設置前端環境
function Setup-Frontend {
    # 檢查是否可以安裝前端
    if (-not $nodeInstalled) {
        Write-Host "無法設置前端，因為 Node.js 未安裝或無法啟動。" -ForegroundColor $RED
        Write-Host "請安裝 Node.js 後再試。" -ForegroundColor $RED
        return
    }
    
    Write-Host "設置前端環境..." -ForegroundColor $GREEN
    Set-Location -Path $FRONTEND_DIR
    
    # 檢查 .env 文件
    if (-not (Test-Path -Path ".env")) {
        Write-Host "創建 .env 檔案..." -ForegroundColor $YELLOW
        $envContent = @"
# 本地開發環境設定
API_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=http://localhost:8000
"@
        Set-Content -Path ".env" -Value $envContent -Force
    }

    # 清理現有安裝
    $cleanInstall = $true
    if (Test-Path -Path "node_modules") {
        $cleanAsk = Read-Host "發現現有的 node_modules，是否清理重新安裝? (y/n)"
        $cleanInstall = ($cleanAsk -eq "y")
    }
    
    if ($cleanInstall) {
        Write-Host "清理現有安裝..." -ForegroundColor $YELLOW
        # 刪除 node_modules
        if (Test-Path -Path "node_modules") {
            Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
            # 檢查是否成功刪除
            if (Test-Path -Path "node_modules") {
                Write-Host "無法刪除 node_modules，嘗試使用系統命令..." -ForegroundColor $RED
                cmd /c "rmdir /s /q node_modules"
            }
        }
        
        # 刪除 npm 快取
        npm cache clean --force
        
        # 刪除 package-lock.json
        if (Test-Path -Path "package-lock.json") {
            Remove-Item "package-lock.json" -Force -ErrorAction SilentlyContinue
        }
    }
    
    # 修復 src\lib\types.ts 文件
    if (Test-Path -Path "src\lib\types.ts") {
        Write-Host "備份 types.ts 文件..." -ForegroundColor $YELLOW
        Copy-Item -Path "src\lib\types.ts" -Destination "src\lib\types.ts.bak" -Force
        
        Write-Host "修復 types.ts 文件中的枚舉聲明..." -ForegroundColor $YELLOW
        $typesContent = Get-Content -Path "src\lib\types.ts" -Raw
        
        # 修復重複的枚舉定義
        if ($typesContent -match "export enum USER_ROLES" -and $typesContent -match "export const ROLES") {
            $typesContent = $typesContent -replace "export const ROLES[^;]+;", ""
            Set-Content -Path "src\lib\types.ts" -Value $typesContent -Force
            Write-Host "已移除重複的角色定義。" -ForegroundColor $GREEN
        }
    }
    
    # 修復 API URL
    $apiFiles = @("src\lib\auth-api.ts", "src\lib\admin-api.ts")
    foreach ($apiFile in $apiFiles) {
        if (Test-Path -Path $apiFile) {
            $apiContent = Get-Content -Path $apiFile -Raw
            if ($apiContent -match "https://") {
                Write-Host "更新 $apiFile 中的 API URL..." -ForegroundColor $YELLOW
                $apiContent = $apiContent -replace "const API_BASE_URL = '[^']+'", "const API_BASE_URL = 'http://localhost:8000'"
                Set-Content -Path $apiFile -Value $apiContent -Force
            }
        }
    }
    
    # 安裝前端依賴項
    Write-Host "安裝前端依賴項 (使用 --legacy-peer-deps 以解決相容性問題)..." -ForegroundColor $YELLOW
    npm install --legacy-peer-deps
    
    $installSuccess = $?
    if ($installSuccess) {
        Write-Host "✓ 前端依賴項安裝完成！" -ForegroundColor $GREEN
    } else {
        Write-Host "✗ 前端依賴項安裝失敗。嘗試分批安裝..." -ForegroundColor $RED
        
        # 分批安裝核心依賴項
        Write-Host "安裝核心依賴項..." -ForegroundColor $YELLOW
        npm install next@13.5.4 react@18.2.0 react-dom@18.2.0 --no-fund --no-audit --legacy-peer-deps
        
        # 分批安裝 UI 套件
        Write-Host "安裝 UI 套件..." -ForegroundColor $YELLOW
        npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox --no-fund --no-audit --legacy-peer-deps
        npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-menubar --no-fund --no-audit --legacy-peer-deps
        npm install @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area --no-fund --no-audit --legacy-peer-deps
        npm install @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot --no-fund --no-audit --legacy-peer-deps
        npm install @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip --no-fund --no-audit --legacy-peer-deps
        
        # 分批安裝工具套件
        Write-Host "安裝工具套件..." -ForegroundColor $YELLOW
        npm install @hookform/resolvers @tanstack/react-query class-variance-authority clsx date-fns --no-fund --no-audit --legacy-peer-deps
        npm install lucide-react react-day-picker react-hook-form recharts tailwind-merge tailwindcss-animate zod --no-fund --no-audit --legacy-peer-deps
        
        # 分批安裝開發依賴項
        Write-Host "安裝開發依賴項..." -ForegroundColor $YELLOW
        npm install --save-dev @types/node @types/react @types/react-dom postcss tailwindcss typescript --no-fund --no-audit --legacy-peer-deps
        
        Write-Host "✓ 分批安裝完成！" -ForegroundColor $GREEN
    }
    
    # 返回到根目錄
    Set-Location -Path $PROJECT_ROOT
}

# 設置後端環境
function Setup-Backend {
    # 檢查是否可以安裝後端
    if (-not $pythonInstalled) {
        Write-Host "無法設置後端，因為 Python 未安裝或無法啟動。" -ForegroundColor $RED
        Write-Host "請安裝 Python 後再試。" -ForegroundColor $RED
        return
    }
    
    Write-Host "設置後端環境..." -ForegroundColor $GREEN
    
    # 檢查後端目錄是否存在
    if (-not (Test-Path -Path $BACKEND_DIR)) {
        Write-Host "找不到後端目錄：$BACKEND_DIR" -ForegroundColor $RED
        return
    }
    
    Set-Location -Path $BACKEND_DIR
    
    # 創建虛擬環境
    $venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
    if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
        Write-Host "創建新的 Python 虛擬環境..." -ForegroundColor $YELLOW
        python -m venv $venvPath
        
        if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
            Write-Host "無法創建虛擬環境。請確認您已安裝 venv 模組。" -ForegroundColor $RED
            return
        }
    } else {
        Write-Host "找到現有的虛擬環境。" -ForegroundColor $GREEN
    }
    
    # 激活虛擬環境
    Write-Host "激活虛擬環境..." -ForegroundColor $GREEN
    try {
        & "$venvPath\Scripts\activate.ps1"
        Write-Host "虛擬環境已激活。" -ForegroundColor $GREEN
    } catch {
        Write-Host "無法激活虛擬環境。" -ForegroundColor $RED
        Write-Host $_.Exception.Message -ForegroundColor $RED
        return
    }
    
    # 確保有 requirements.txt 文件
    $requirementsFile = Join-Path -Path $BACKEND_DIR -ChildPath "requirements.txt"
    if (-not (Test-Path -Path $requirementsFile)) {
        Write-Host "找不到 requirements.txt，將創建一個基本版本..." -ForegroundColor $YELLOW
        
        $requirementsContent = @"
django==4.2.10
djangorestframework==3.14.0
djangorestframework-simplejwt==5.3.0
django-cors-headers==4.3.1
python-dotenv==1.0.0
"@
        
        Set-Content -Path $requirementsFile -Value $requirementsContent -Force
        Write-Host "已創建 requirements.txt" -ForegroundColor $GREEN
    }
    
    # 安裝依賴項
    Write-Host "正在安裝 Python 依賴項..." -ForegroundColor $GREEN
    try {
        pip install -r $requirementsFile
        Write-Host "依賴項安裝成功。" -ForegroundColor $GREEN
    } catch {
        Write-Host "安裝依賴項時出錯。" -ForegroundColor $RED
        Write-Host $_.Exception.Message -ForegroundColor $RED
        return
    }
    
    # 檢查和設置 CORS 設定
    $settingsPath = Join-Path -Path $BACKEND_DIR -ChildPath "backend\settings.py"
    if (Test-Path -Path $settingsPath) {
        $settingsContent = Get-Content -Path $settingsPath -Raw
        $corsUpdated = $false
        
        # 檢查 CORS 設定
        if ($settingsContent -notmatch "CORS_ALLOWED_ORIGINS") {
            Write-Host "未找到 CORS 設置，將添加..." -ForegroundColor $YELLOW
            $corsSettings = @"

# CORS 設定
CORS_ALLOWED_ORIGINS = [
    'http://localhost:9002',
    'http://127.0.0.1:9002',
]
CORS_ALLOW_METHODS = ['DELETE', 'GET', 'OPTIONS', 'PATCH', 'POST', 'PUT']
CORS_ALLOW_CREDENTIALS = True
"@
            $settingsContent = $settingsContent + $corsSettings
            $corsUpdated = $true
        } elseif ($settingsContent -notmatch "localhost:9002") {
            Write-Host "更新 CORS 設定..." -ForegroundColor $YELLOW
            $settingsContent = $settingsContent -replace "(CORS_ALLOWED_ORIGINS\s*=\s*\[\s*)([^\]]*)", "`$1    'http://localhost:9002',`n    'http://127.0.0.1:9002',`n`$2"
            $corsUpdated = $true
        }
        
        # 檢查必要的應用程序
        $requiredApps = @('corsheaders')
        foreach ($app in $requiredApps) {
            if ($settingsContent -notmatch "corsheaders") {
                Write-Host "添加 $app 到已安裝的應用程序..." -ForegroundColor $YELLOW
                $settingsContent = $settingsContent -replace "(INSTALLED_APPS\s*=\s*\[\s*)([^\]]*)", "`$1    'corsheaders',`n`$2"
                $corsUpdated = $true
            }
        }
        
        # 檢查中間件
        if ($settingsContent -notmatch "corsheaders\.middleware") {
            Write-Host "添加 CORS 中間件..." -ForegroundColor $YELLOW
            $settingsContent = $settingsContent -replace "(MIDDLEWARE\s*=\s*\[\s*)([^\]]*)", "`$1    'corsheaders.middleware.CorsMiddleware',`n`$2"
            $corsUpdated = $true
        }
        
        # 更新設定文件
        if ($corsUpdated) {
            Set-Content -Path $settingsPath -Value $settingsContent -Force
            Write-Host "已更新 Django 設定。" -ForegroundColor $GREEN
        } else {
            Write-Host "CORS 設定已經正確設置。" -ForegroundColor $GREEN
        }
    } else {
        Write-Host "找不到 settings.py 文件。請確保後端專案結構正確。" -ForegroundColor $RED
    }
    
    # 運行遷移
    Write-Host "運行數據庫遷移..." -ForegroundColor $GREEN
    try {
        python manage.py makemigrations
        python manage.py migrate
        Write-Host "數據庫遷移成功。" -ForegroundColor $GREEN
    } catch {
        Write-Host "數據庫遷移出錯。" -ForegroundColor $RED
        Write-Host $_.Exception.Message -ForegroundColor $RED
    }
    
    # 返回到源目錄
    deactivate
    Set-Location -Path $PROJECT_ROOT
}

# 執行自動修復
function Run-AutoRepair {
    Write-Host "執行自動修復..." -ForegroundColor $MAGENTA
    
    # 修復前端
    if ($nodeInstalled) {
        Write-Host "修復前端問題..." -ForegroundColor $YELLOW
        Setup-Frontend
    } else {
        Write-Host "無法修復前端，因為 Node.js 未安裝。" -ForegroundColor $RED
    }
    
    # 修復後端
    if ($pythonInstalled) {
        Write-Host "修復後端問題..." -ForegroundColor $YELLOW
        Setup-Backend
    } else {
        Write-Host "無法修復後端，因為 Python 未安裝。" -ForegroundColor $RED
    }
    
    Write-Host "自動修復完成！" -ForegroundColor $MAGENTA
}

# 根據選項執行相應的操作
switch ($choice) {
    "1" { Setup-Frontend }
    "2" { Setup-Backend }
    "3" { 
        Setup-Frontend
        Setup-Backend 
    }
    "4" {
        $needRepair = Check-And-Fix-Environment
        if ($needRepair) {
            Run-AutoRepair
        }
    }
    "0" { 
        Write-Host "謝謝使用！" -ForegroundColor $GREEN
        exit
    }
    default { 
        Write-Host "選項無效，請重新運行腳本。" -ForegroundColor $RED
    }
}

# 顯示完成訊息
Write-Host ""
Write-Host "安裝程序完成！" -ForegroundColor $MAGENTA
Write-Host ""
Write-Host "如果您想啟動前端，請執行：" -ForegroundColor $CYAN
Write-Host "  cd $FRONTEND_DIR" -ForegroundColor $YELLOW
Write-Host "  npm run dev" -ForegroundColor $YELLOW
Write-Host ""
Write-Host "如果您想啟動後端，請執行：" -ForegroundColor $CYAN
Write-Host "  cd $BACKEND_DIR" -ForegroundColor $YELLOW
Write-Host "  & '$venvPath\Scripts\activate.ps1'" -ForegroundColor $YELLOW
Write-Host "  python manage.py runserver" -ForegroundColor $YELLOW
Write-Host ""
