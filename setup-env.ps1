# 確保在 PowerShell 中 `curl` 呼叫外部 curl.exe
Set-Alias curl curl.exe -Scope Script

# Setting color constants
$GREEN = [System.ConsoleColor]::Green
$YELLOW = [System.ConsoleColor]::Yellow
$CYAN = [System.ConsoleColor]::Cyan
$RED = [System.ConsoleColor]::Red

# Set project paths
$PROJECT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path -Path $PROJECT_ROOT -ChildPath "backend"

# Display welcome message
Write-Host "=======================================" -ForegroundColor $GREEN
Write-Host "  Taoyuan Eagles Dev Environment Tool  " -ForegroundColor $GREEN
Write-Host "=======================================" -ForegroundColor $GREEN
Write-Host ""

function Show-Menu {
    Write-Host "Choose an option:" -ForegroundColor $CYAN
    Write-Host "1. Setup Frontend" -ForegroundColor $CYAN
    Write-Host "2. Setup Backend" -ForegroundColor $CYAN
    Write-Host "3. Start Frontend Server" -ForegroundColor $CYAN
    Write-Host "4. Start Backend Server" -ForegroundColor $CYAN
    Write-Host "5. Setup Everything (Frontend+Backend)" -ForegroundColor $CYAN
    Write-Host "6. Start Everything (Frontend+Backend)" -ForegroundColor $CYAN
    Write-Host "0. Exit" -ForegroundColor $CYAN
    Write-Host ""
    $choice = Read-Host "Enter your choice"
    return $choice
}

function Initialize-Frontend {
    Write-Host "Setting up frontend environment..." -ForegroundColor $GREEN
    Set-Location -Path $PROJECT_ROOT

    # Check if node_modules exists
    if (Test-Path -Path "node_modules") {
        $cleanNode = Read-Host "Clean existing node_modules? (y/n)"
        if ($cleanNode -eq "y") {
            Write-Host "Removing node_modules..." -ForegroundColor $YELLOW
            Remove-Item -Recurse -Force node_modules
        }
    }

    # Check if package-lock.json exists
    if (Test-Path -Path "package-lock.json") {
        $cleanLock = Read-Host "Delete package-lock.json? (y/n)"
        if ($cleanLock -eq "y") {
            Write-Host "Removing package-lock.json..." -ForegroundColor $YELLOW
            Remove-Item -Force package-lock.json
        }
    }

    # Fix types.ts file
    if (Test-Path -Path "src\lib\types.ts.new") {
        Write-Host "Updating types.ts file..." -ForegroundColor $YELLOW
        Copy-Item -Path "src\lib\types.ts.new" -Destination "src\lib\types.ts" -Force
    }

    # Create a fixed types.ts file to resolve the enum errors
    $typesContent = @'
    // Types for user roles and permissions
    export enum USER_ROLES {
      ADMIN = 'admin',
      COACH = 'coach',
      PLAYER = 'player',
      GUEST = 'guest',
    }

    export interface User {
      id: string;
      username: string;
      email: string;
      role: USER_ROLES;
      teamId?: string;
      createdAt: string;
    }

    export interface Match {
      id: string;
      date: string;
      startTime: string;
      durationMinutes: number;
      leagueId: string;
      opponentTeamId: string;
      location: string;
      group: string;
      levelU: string;
      stats: { [playerId: string]: PlayerMatchStats };
    }

    export interface PlayerMatchStats {
      goals: number;
      assists: number;
      yellow: number;
      red: number;
    }

    export interface League {
      id: string;
      name: string;
      group: string;
      levelU: string;
      format: '5人制' | '8人制' | '11人制' | '';
      notes: string;
    }

    export interface Team {
      id: string;
      name: string;
      notes: string;
    }

    export interface Player {
      id: string;
      name: string;
      participatingLeagueIds: string[];
      positions: string[];
      injured: '是' | '否';
      notes: string;
      group: string;
      levelU: string;
    }

    export interface MatchRosterItem {
      playerId: string;
      position: string;
    }

    export interface MatchRoster {
      [matchId: string]: MatchRosterItem[];
    }

    export type MatchAvailability = {
      [matchId: string]: { [playerId: string]: boolean };
    };

    export interface AppData {
      matches: Match[];
      leagues: League[];
      teams: Team[];
      players: Player[];
      matchRosters: MatchRoster;
      matchAvailability: MatchAvailability;
    }

    export type PlayerPosition = 
      | "守門員 (GK)" | "右後衛 (RB)" | "左後衛 (LB)" | "中後衛 (CB)" 
      | "防守中場 (DMF)" | "右中場 (RMF)" | "左中場 (LMF)" | "進攻中場 (AMF)"
      | "右邊鋒 (RWF)" | "左邊鋒 (LWF)" | "中鋒 (CF)"
      | "左前鋒" | "右前鋒" | "中前鋒";

    export const playerPositionOptions: PlayerPosition[] = [
      "守門員 (GK)", "右後衛 (RB)", "左後衛 (LB)", "中後衛 (CB)", 
      "防守中場 (DMF)", "右中場 (RMF)", "左中場 (LMF)", "進攻中場 (AMF)",
      "右邊鋒 (RWF)", "左邊鋒 (LWF)", "中鋒 (CF)",
      "左前鋒", "右前鋒", "中前鋒"
    ];

    export type AgeGroup = "幼兒組" | "國小組" | "國中組" | "高中組" | "大學組" | "成人組" | "all";

    export const ageGroups: Exclude<AgeGroup, "all">[] = ["幼兒組", "國小組", "國中組", "高中組", "大學組", "成人組"];

    export const levelOptions: Record<Exclude<AgeGroup, "all">, string[]> = { 
      "幼兒組": ["U6"], 
      "國小組": ["U8", "U10", "U12"], 
      "國中組": ["U14", "U15"], 
      "高中組": ["U16", "U18"], 
      "大學組": ["甲組", "乙組", "其他組"], 
      "成人組": ["企業組", "家長組"]
    };

    // Role constants
    export const ROLES = {
      GUEST: 'guest',
      PLAYER: 'player',
      COACH: 'coach',
      ADMIN: 'admin'
    }
'@  # 關閉 here-string
    # Create/overwrite the types.ts file
    Set-Content -Path "src\lib\types.ts" -Value $typesContent -Force

    # Install npm packages
    Write-Host "Installing frontend dependencies..." -ForegroundColor $GREEN
    npm install --legacy-peer-deps

    Write-Host "Frontend setup complete!" -ForegroundColor $GREEN
}

function Initialize-Backend {
    Write-Host "Setting up backend environment..." -ForegroundColor $GREEN
    Set-Location -Path $BACKEND_DIR

    # Check virtual environment
    $venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
    if (-not (Test-Path -Path "$venvPath\Scripts\activate.ps1")) {
        Write-Host "Creating new Python virtual environment..." -ForegroundColor $YELLOW
        python -m venv $venvPath
    }

    # Activate virtual environment
    Write-Host "Activating virtual environment..." -ForegroundColor $GREEN
    & "$venvPath\Scripts\activate.ps1"

    # Install backend packages
    if (Test-Path -Path "requirements.txt") {
        Write-Host "Installing Python dependencies..." -ForegroundColor $GREEN
        pip install -r requirements.txt
    } else {
        Write-Host "Installing basic Python dependencies..." -ForegroundColor $YELLOW
        pip install django djangorestframework djangorestframework-simplejwt django-cors-headers python-dotenv
    }

    # Run database migrations
    Write-Host "Running database migrations..." -ForegroundColor $GREEN
    python manage.py migrate

    Write-Host "Backend setup complete!" -ForegroundColor $GREEN
    # Return to source directory
    deactivate
    Set-Location -Path $PROJECT_ROOT
}

function Start-Frontend {
    Write-Host "Starting frontend development server..." -ForegroundColor $GREEN
    Set-Location -Path $PROJECT_ROOT
    npm run dev
}

function Start-Backend {
    Write-Host "Starting backend development server..." -ForegroundColor $GREEN
    Set-Location -Path $BACKEND_DIR
    $venvPath = Join-Path -Path $PROJECT_ROOT -ChildPath "venv_backend"
    & "$venvPath\Scripts\activate.ps1"
    python manage.py runserver
}

# Main program
$choice = Show-Menu
switch ($choice) {
    "1" { Initialize-Frontend }
    "2" { Initialize-Backend }
    "3" { Start-Frontend }
    "4" { Start-Backend }
    "5" { 
        Initialize-Frontend
        Initialize-Backend 
    }
    "6" {
        Start-Job -ScriptBlock {
            Set-Location -Path $using:BACKEND_DIR
            $venvPath = Join-Path -Path $using:PROJECT_ROOT -ChildPath "venv_backend"
            & "$venvPath\Scripts\activate.ps1"
            python manage.py runserver
        }
        
        Write-Host "Backend server started in background..." -ForegroundColor $GREEN
        Start-Frontend
    }
    "0" { 
        Write-Host "Thank you for using this tool. Goodbye!" -ForegroundColor $GREEN
        exit
    }
    default { 
        Write-Host "Invalid option, please run the script again." -ForegroundColor $RED
    }
}
