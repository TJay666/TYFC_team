# 清理前端部分
Write-Host "清理前端環境..." -ForegroundColor Green
if (Test-Path -Path "node_modules") {
    Write-Host "移除 node_modules 資料夾..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules
}

if (Test-Path -Path "package-lock.json") {
    Write-Host "移除 package-lock.json 檔案..." -ForegroundColor Yellow
    Remove-Item -Force package-lock.json
}

if (Test-Path -Path ".next") {
    Write-Host "移除 .next 資料夾..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force .next
}

# 安裝前端依賴
Write-Host "安裝前端相依套件..." -ForegroundColor Green
npm install next@13.5.4 react@18.2.0 react-dom@18.2.0 --save
npm install --save-dev typescript @types/node @types/react @types/react-dom

# 安裝其他必要的前端套件
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip
npm install @hookform/resolvers react-hook-form zod tailwindcss sass class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate date-fns dotenv

# 清理後端部分
Write-Host "設定後端環境..." -ForegroundColor Green
cd .\backend\

# 確認虛擬環境
if (!(Test-Path -Path "..\venv_backend\Scripts\activate.ps1")) {
    Write-Host "創建新的虛擬環境..." -ForegroundColor Yellow
    python -m venv ..\venv_backend
}

# 啟用虛擬環境
Write-Host "啟用虛擬環境..." -ForegroundColor Green
& ..\venv_backend\Scripts\activate.ps1

# 安裝後端需要的套件
Write-Host "安裝後端相依套件..." -ForegroundColor Green
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers

# 回到根目錄
cd ..

Write-Host "環境設置完成！" -ForegroundColor Green
Write-Host "請執行以下命令來啟動專案：" -ForegroundColor Cyan
Write-Host "前端：npm run dev" -ForegroundColor Cyan
Write-Host "後端：cd backend && ..\venv_backend\Scripts\activate.ps1 && python manage.py runserver" -ForegroundColor Cyan
