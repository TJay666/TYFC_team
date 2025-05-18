# Force install script
# Set color constants
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$RED = [System.ConsoleColor]::Red

# Pause OneDrive to avoid file lock issues
Write-Host "Pausing OneDrive sync to prevent file locks..." -ForegroundColor $YELLOW
Get-Process OneDrive -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "===== Force install npm packages =====" -ForegroundColor $GREEN
Write-Host ""

# Exit if project is inside OneDrive-synced folder to avoid file lock issues
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
if ($PROJECT_ROOT -like '*OneDrive*') {
    Write-Host 'ERROR: Project path is under OneDrive. Please move the project to a local path (e.g. C:\projects\tyfc_team) and rerun this script.' -ForegroundColor $RED
    exit 1
}

# Set project directory
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
# Warn and exit if project is inside OneDrive to avoid file locks
if ($PROJECT_ROOT -like '*OneDrive*') {
    Write-Host 'ERROR: Project is in a OneDrive-synced folder. Please move it to a local path (e.g. C:\projects\tyfc_team) and rerun.' -ForegroundColor $RED
    exit 1
}
Set-Location -Path $PROJECT_ROOT

# 1. Clean existing installation
Write-Host "1. Cleaning existing installation..." -ForegroundColor $YELLOW

# Remove node_modules
if (Test-Path -Path "node_modules") {
    Write-Host "   Removing node_modules directory..." -ForegroundColor $YELLOW
    cmd /c "rmdir /s /q node_modules"
    Start-Sleep -Seconds 1
}

# Remove package-lock.json
if (Test-Path -Path "package-lock.json") {
    Write-Host "   Removing package-lock.json..." -ForegroundColor $YELLOW
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
}

# 2. Clean npm cache
Write-Host "2. Cleaning npm cache..." -ForegroundColor $YELLOW
npm cache clean --force

# Remove problematic esbuild if exists
Write-Host "   Removing existing esbuild module if present..." -ForegroundColor $YELLOW
if (Test-Path -Path "node_modules\esbuild") {
    Remove-Item -Recurse -Force "node_modules\esbuild" -ErrorAction SilentlyContinue
}
# Install esbuild separately to handle Windows binary issues
Write-Host "   Installing esbuild separately..." -ForegroundColor $YELLOW
npm install esbuild --force

# 3. Install core packages
Write-Host "3. Installing core packages (React and Next.js)..." -ForegroundColor $YELLOW
npm install next@13.5.4 react@18.2.0 react-dom@18.2.0 --force

# Check core installation result
if ($LASTEXITCODE -ne 0) {
    Write-Host "Core installation failed. Trying alternative strategy..." -ForegroundColor $RED
    Write-Host "   Trying with --legacy-peer-deps..." -ForegroundColor $YELLOW
    npm i next@13.5.4 react@18.2.0 react-dom@18.2.0 --legacy-peer-deps
}

# 4. Install remaining dependencies
Write-Host "4. Installing remaining dependencies..." -ForegroundColor $YELLOW
npm i --force

# Check dependencies installation result
if ($LASTEXITCODE -ne 0) {
    Write-Host "Dependencies installation failed. Trying alternative strategy..." -ForegroundColor $RED
    Write-Host "   Trying with --legacy-peer-deps..." -ForegroundColor $YELLOW
    npm i --legacy-peer-deps
}

# 5. Check installation results
Write-Host "5. Checking installation results..." -ForegroundColor $YELLOW
if (Test-Path -Path "node_modules\next") {
    Write-Host "Installation successful! Next.js is installed." -ForegroundColor $GREEN
    Write-Host "You can run 'npm run dev' to start the application." -ForegroundColor $GREEN
} else {
    Write-Host "Installation may be incomplete. Next.js not found." -ForegroundColor $RED

    # Final attempt
    Write-Host "6. Final attempt - installing Next.js only..." -ForegroundColor $YELLOW
    npm i next@13.5.4 --force --no-fund --no-audit
}
