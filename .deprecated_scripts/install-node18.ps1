# Node.js v18 LTS Installation Guide
# Set color constants
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red

Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host "  Node.js v18 LTS Installation Guide  " -ForegroundColor $GREEN
Write-Host "=====================================" -ForegroundColor $GREEN
Write-Host ""

# Check current Node.js version
try {
    $currentNodeVersion = node -v
    Write-Host "Detected Node.js version: $currentNodeVersion" -ForegroundColor $YELLOW
} catch {
    Write-Host "Node.js not detected." -ForegroundColor $RED
}

# URL for Node.js v18 LTS installer
$nodeJsV18Url = "https://nodejs.org/dist/v18.18.2/node-v18.18.2-x64.msi"

Write-Host "Steps to install Node.js v18 LTS:" -ForegroundColor $CYAN
Write-Host "" 
Write-Host "1. Download the Node.js v18 LTS installer:" -ForegroundColor $YELLOW
Write-Host "   $nodeJsV18Url" -ForegroundColor $CYAN
Write-Host "" 
Write-Host "2. Run the installer and follow the prompts to complete installation." -ForegroundColor $YELLOW
Write-Host "   • The installer will upgrade/downgrade your existing Node.js installation if necessary." -ForegroundColor $CYAN
Write-Host "" 
Write-Host "3. After installation, restart your terminal session." -ForegroundColor $YELLOW
Write-Host ""

# Prompt to automatically download Node.js v18
$downloadChoice = Read-Host "Download Node.js v18 installer automatically? (y/n)"

if ($downloadChoice -eq "y") {
    $downloadPath = "$env:USERPROFILE\Downloads\node-v18.18.2-x64.msi"
    Write-Host "Downloading Node.js v18 LTS..." -ForegroundColor $YELLOW
    try {
        Invoke-WebRequest -Uri $nodeJsV18Url -OutFile $downloadPath
        Write-Host "Download complete! File saved to: $downloadPath" -ForegroundColor $GREEN
        # Prompt to run installer immediately
        $installChoice = Read-Host "Run installer now? (y/n)"
        if ($installChoice -eq "y") {
            Write-Host "Launching installer..." -ForegroundColor $YELLOW
            Start-Process -FilePath $downloadPath -Wait
            Write-Host "Installer has completed. Restart your terminal and verify Node.js version." -ForegroundColor $GREEN
        } else {
            Write-Host "Please run the installer manually: $downloadPath" -ForegroundColor $YELLOW
        }
    } catch {
        Write-Host "Download failed. Please manually download from the following URL:" -ForegroundColor $RED
        Write-Host $nodeJsV18Url -ForegroundColor $CYAN
    }
} else {
    Write-Host "Please manually download from the following URL:" -ForegroundColor $YELLOW
    Write-Host $nodeJsV18Url -ForegroundColor $CYAN
}

Write-Host "" 
Write-Host "After installation, run the following command to verify Node.js version:" -ForegroundColor $CYAN
Write-Host "node -v" -ForegroundColor $GREEN
Write-Host ""
Write-Host "Once v18.x.x is confirmed, return to the project directory and run the fix script:" -ForegroundColor $CYAN
Write-Host "cd '$(Get-Location)'; .\force-install.ps1" -ForegroundColor $GREEN
Write-Host ""
