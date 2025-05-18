# Python 後端設定腳本
# Setting color constants
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red

# 顯示歡迎訊息
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host "  後端設定工具 - 桃園獵鷹管理平台  " -ForegroundColor $GREEN
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host ""

# 設置專案路徑
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path -Path $PROJECT_ROOT -ChildPath "backend"

# 檢查 Python 是否安裝
try {
    $pythonVersion = python --version
    Write-Host "檢測到 $pythonVersion" -ForegroundColor $YELLOW
} catch {
    Write-Host "無法找到 Python。請確保 Python 已安裝並加入到系統路徑中。" -ForegroundColor $RED
    exit
}

# 進入後端資料夾
Write-Host "進入後端資料夾..." -ForegroundColor $CYAN
if (-not (Test-Path -Path $BACKEND_DIR)) {
    Write-Host "找不到後端資料夾：$BACKEND_DIR" -ForegroundColor $RED
    exit
}
Set-Location -Path $BACKEND_DIR

# 創建虛擬環境
$venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
    Write-Host "創建新的 Python 虛擬環境..." -ForegroundColor $YELLOW
    python -m venv $venvPath
    
    if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
        Write-Host "無法創建虛擬環境。請確認您已安裝 venv 模組。" -ForegroundColor $RED
        exit
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
    exit
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
    exit
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
        if ($settingsContent -notmatch "django_cors_headers") {
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

# 提醒用戶
Write-Host ""
Write-Host "後端設定完成！" -ForegroundColor $GREEN
Write-Host "您現在可以運行後端服務器：" -ForegroundColor $CYAN
Write-Host "  cd $BACKEND_DIR" -ForegroundColor $YELLOW
Write-Host "  & '$venvPath\Scripts\activate.ps1'" -ForegroundColor $YELLOW
Write-Host "  python manage.py runserver" -ForegroundColor $YELLOW
Write-Host ""

# 返回到源目錄
deactivate
Set-Location -Path $PROJECT_ROOT
