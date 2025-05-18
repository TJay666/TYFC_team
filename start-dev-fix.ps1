# 設定顏色常數
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red

# 設定專案路徑
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path -Path $PROJECT_ROOT -ChildPath "backend"

# 顯示歡迎訊息
Write-Host "===============================================" -ForegroundColor $GREEN
Write-Host "  桃園獵鷹宇宙管理平台 - 開發環境設定工具      " -ForegroundColor $GREEN
Write-Host "===============================================" -ForegroundColor $GREEN
Write-Host ""

function Show-Menu {
    Write-Host "請選擇要執行的操作:" -ForegroundColor $CYAN
    Write-Host "1. 設定前端環境" -ForegroundColor $CYAN
    Write-Host "2. 設定後端環境" -ForegroundColor $CYAN
    Write-Host "3. 啟動前端開發伺服器" -ForegroundColor $CYAN
    Write-Host "4. 啟動後端開發伺服器" -ForegroundColor $CYAN
    Write-Host "5. 全部設定 (前端+後端)" -ForegroundColor $CYAN
    Write-Host "6. 全部啟動 (前端+後端)" -ForegroundColor $CYAN
    Write-Host "0. 退出" -ForegroundColor $CYAN
    Write-Host ""
    $choice = Read-Host "請輸入選項"
    return $choice
}

function Setup-Frontend {
    Write-Host "設定前端環境..." -ForegroundColor $GREEN
    Set-Location -Path $PROJECT_ROOT

    # 檢查是否存在 node_modules 目錄
    if (Test-Path -Path "node_modules") {
        $cleanNode = Read-Host "是否清理現有的 node_modules (y/n)?"
        if ($cleanNode -eq "y") {
            Write-Host "正在移除 node_modules..." -ForegroundColor $YELLOW
            Remove-Item -Recurse -Force node_modules
        }
    }

    # 檢查是否存在 package-lock.json
    if (Test-Path -Path "package-lock.json") {
        $cleanLock = Read-Host "是否刪除 package-lock.json (y/n)?"
        if ($cleanLock -eq "y") {
            Write-Host "移除 package-lock.json..." -ForegroundColor $YELLOW
            Remove-Item -Force package-lock.json
        }
    }

    # 安裝 npm 套件
    Write-Host "安裝前端相依套件..." -ForegroundColor $GREEN
    npm install --legacy-peer-deps

    # 修正 types.ts 檔案
    if (Test-Path -Path "src\lib\types.ts.new") {
        Write-Host "更新 types.ts 檔案..." -ForegroundColor $YELLOW
        Move-Item -Path "src\lib\types.ts.new" -Destination "src\lib\types.ts" -Force
    }

    Write-Host "前端環境設定完成!" -ForegroundColor $GREEN
}

function Setup-Backend {
    Write-Host "設定後端環境..." -ForegroundColor $GREEN
    Set-Location -Path $BACKEND_DIR

    # 檢查虛擬環境
    $venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
    if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
        Write-Host "創建新的 Python 虛擬環境..." -ForegroundColor $YELLOW
        python -m venv $venvPath
    }

    # 啟用虛擬環境
    Write-Host "啟用虛擬環境..." -ForegroundColor $GREEN
    & "$venvPath\Scripts\activate.ps1"

    # 安裝後端套件
    if (Test-Path -Path "requirements.txt") {
        Write-Host "安裝 Python 相依套件..." -ForegroundColor $GREEN
        pip install -r requirements.txt
    } else {
        Write-Host "安裝基本 Python 相依套件..." -ForegroundColor $YELLOW
        pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv
    }

    # 遷移資料庫
    Write-Host "執行資料庫遷移..." -ForegroundColor $GREEN
    python manage.py migrate

    Write-Host "後端環境設定完成!" -ForegroundColor $GREEN
    # 返回來源目錄
    deactivate
    Set-Location -Path $PROJECT_ROOT
}

function Start-Frontend {
    Write-Host "啟動前端開發伺服器..." -ForegroundColor $GREEN
    Set-Location -Path $PROJECT_ROOT
    npm run dev
}

function Start-Backend {
    Write-Host "啟動後端開發伺服器..." -ForegroundColor $GREEN
    Set-Location -Path $BACKEND_DIR
    $venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
    & "$venvPath\Scripts\activate.ps1"
    python manage.py runserver
}

# 主程式
$choice = Show-Menu
switch ($choice) {
    "1" { Setup-Frontend }
    "2" { Setup-Backend }
    "3" { Start-Frontend }
    "4" { Start-Backend }
    "5" { 
        Setup-Frontend
        Setup-Backend 
    }
    "6" {
        $backendJob = Start-Job -ScriptBlock {
            Set-Location -Path $using:BACKEND_DIR
            $venvPath = Join-Path -Path $using:PROJECT_ROOT -ChildPath "venv_backend"
            & "$venvPath\Scripts\activate.ps1"
            python manage.py runserver
        }
        
        Write-Host "後端伺服器已在背景啟動..." -ForegroundColor $GREEN
        Start-Frontend
    }
    "0" { 
        Write-Host "謝謝使用，再見!" -ForegroundColor $GREEN
        exit
    }
    default { 
        Write-Host "無效的選項，請重新執行腳本。" -ForegroundColor $RED
    }
}
