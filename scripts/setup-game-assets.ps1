# PowerShell script de copy assets va static files tu game folder sang public/assets va public/static
# Usage: 
#   .\setup-game-assets.ps1 -GameName "frog-game"     # Chi dinh mot game
#   .\setup-game-assets.ps1 -All                       # Tu dong quet tat ca games

param(
    [Parameter(Mandatory=$false)]
    [string]$GameName,
    
    [Parameter(Mandatory=$false)]
    [switch]$All
)

# Duong dan goc cua project (tu scripts/ folder)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Duong dan destination
$PublicAssetsPath = Join-Path $ProjectRoot "public\assets"
$PublicStaticPath = Join-Path $ProjectRoot "public\static"
$GamesFolder = Join-Path $ProjectRoot "public\games"

# Function de merge folder (de quy)
function Merge-Folder {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [string]$Type,
        [ref]$CopiedCount,
        [ref]$SkippedCount,
        [ref]$ErrorCount
    )

    if (-not (Test-Path $SourcePath)) {
        return
    }

    # Tao destination folder neu chua ton tai
    if (-not (Test-Path $DestPath)) {
        New-Item -ItemType Directory -Path $DestPath -Force | Out-Null
    }

    # Lay tat ca items trong source folder
    $items = Get-ChildItem -Path $SourcePath

    foreach ($item in $items) {
        try {
            $destItemPath = Join-Path $DestPath $item.Name

            if ($item.PSIsContainer) {
                # Neu la folder
                if (Test-Path $destItemPath) {
                    # Folder da ton tai, merge noi dung ben trong
                    Merge-Folder -SourcePath $item.FullName -DestPath $destItemPath -Type $Type -CopiedCount $CopiedCount -SkippedCount $SkippedCount -ErrorCount $ErrorCount
                }
                else {
                    # Folder chua ton tai, copy toan bo
                    Copy-Item -Path $item.FullName -Destination $destItemPath -Recurse -Force
                    Write-Host "[$Type] Da copy folder: $($item.Name)" -ForegroundColor Cyan
                    $CopiedCount.Value++
                }
            }
            else {
                # Neu la file
                if (Test-Path $destItemPath) {
                    # File da ton tai, bo qua hoac rename
                    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
                    $extension = [System.IO.Path]::GetExtension($item.Name)
                    $counter = 1
                    $newDestPath = $destItemPath

                    # Tim ten file moi neu trung
                    while (Test-Path $newDestPath) {
                        $newDestPath = Join-Path $DestPath "$baseName`_$counter$extension"
                        $counter++
                    }

                    Copy-Item -Path $item.FullName -Destination $newDestPath -Force
                    Write-Host "[$Type] File trung ten, da doi ten: $([System.IO.Path]::GetFileName($newDestPath))" -ForegroundColor Yellow
                    $CopiedCount.Value++
                }
                else {
                    # File chua ton tai, copy binh thuong
                    Copy-Item -Path $item.FullName -Destination $destItemPath -Force
                    Write-Host "[$Type] Da copy file: $($item.Name)" -ForegroundColor Cyan
                    $CopiedCount.Value++
                }
            }
        }
        catch {
            Write-Error "[$Type] Loi khi xu ly $($item.Name): $_"
            $ErrorCount.Value++
        }
    }
}

# Function de copy files va folders (co merge)
function Copy-GameFiles {
    param(
        [string]$SourcePath,
        [string]$DestPath,
        [string]$Type
    )

    if (-not (Test-Path $SourcePath)) {
        Write-Warning "[$Type] Source path khong ton tai: $SourcePath"
        return $false
    }

    # Tao destination folder neu chua ton tai
    if (-not (Test-Path $DestPath)) {
        New-Item -ItemType Directory -Path $DestPath -Force | Out-Null
        Write-Host "[$Type] Da tao thu muc: $DestPath" -ForegroundColor Green
    }

    $copiedCount = 0
    $skippedCount = 0
    $errorCount = 0

    # Lay tat ca items trong source folder
    $rootItems = Get-ChildItem -Path $SourcePath

    if ($rootItems.Count -eq 0) {
        Write-Host "[$Type] Khong co files/folders de copy" -ForegroundColor Yellow
        return $true
    }

    # Su dung Merge-Folder de merge tat ca items
    foreach ($item in $rootItems) {
        $destItemPath = Join-Path $DestPath $item.Name
        
        if ($item.PSIsContainer) {
            # Neu la folder, merge de quy
            Merge-Folder -SourcePath $item.FullName -DestPath $destItemPath -Type $Type -CopiedCount ([ref]$copiedCount) -SkippedCount ([ref]$skippedCount) -ErrorCount ([ref]$errorCount)
        }
        else {
            # Neu la file, xu ly truc tiep
            try {
                if (Test-Path $destItemPath) {
                    # File da ton tai, rename
                    $baseName = [System.IO.Path]::GetFileNameWithoutExtension($item.Name)
                    $extension = [System.IO.Path]::GetExtension($item.Name)
                    $counter = 1
                    $newDestPath = $destItemPath

                    while (Test-Path $newDestPath) {
                        $newDestPath = Join-Path $DestPath "$baseName`_$counter$extension"
                        $counter++
                    }

                    Copy-Item -Path $item.FullName -Destination $newDestPath -Force
                    Write-Host "[$Type] File trung ten, da doi ten: $([System.IO.Path]::GetFileName($newDestPath))" -ForegroundColor Yellow
                    $copiedCount++
                }
                else {
                    Copy-Item -Path $item.FullName -Destination $destItemPath -Force
                    Write-Host "[$Type] Da copy file: $($item.Name)" -ForegroundColor Cyan
                    $copiedCount++
                }
            }
            catch {
                Write-Error "[$Type] Loi khi copy file $($item.Name): $_"
                $errorCount++
            }
        }
    }

    # Bao cao ket qua
    $color = if ($errorCount -eq 0) { "Green" } else { "Yellow" }
    Write-Host "[$Type] Hoan thanh: $copiedCount items da copy, $skippedCount items bi bo qua, $errorCount loi" -ForegroundColor $color
    
    return $errorCount -eq 0
}

# Function de xu ly mot game
function Process-Game {
    param(
        [string]$GameName
    )

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Processing game: $GameName" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""

    # Duong dan source
    $GameAssetsPath = Join-Path $GamesFolder "$GameName\assets"
    $GameStaticPath = Join-Path $GamesFolder "$GameName\static"
    $GameFolder = Join-Path $GamesFolder $GameName

    # Kiem tra game folder co ton tai khong
    if (-not (Test-Path $GameFolder)) {
        Write-Warning "Game folder khong ton tai: $GameFolder"
        return @{ Success = $false; GameName = $GameName }
    }

    # Copy assets
    Write-Host "[$GameName - ASSETS] Bat dau copy assets..." -ForegroundColor Yellow
    $assetsSuccess = Copy-GameFiles -SourcePath $GameAssetsPath -DestPath $PublicAssetsPath -Type "ASSETS"
    Write-Host ""

    # Copy static
    Write-Host "[$GameName - STATIC] Bat dau copy static files..." -ForegroundColor Yellow
    $staticSuccess = Copy-GameFiles -SourcePath $GameStaticPath -DestPath $PublicStaticPath -Type "STATIC"
    Write-Host ""

    $overallSuccess = $assetsSuccess -and $staticSuccess

    return @{
        Success = $overallSuccess
        GameName = $GameName
        AssetsSuccess = $assetsSuccess
        StaticSuccess = $staticSuccess
    }
}

# Function de quet tat ca games
function Scan-AllGames {
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "Scan All Games Mode" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host ""

    # Kiem tra games folder co ton tai khong
    if (-not (Test-Path $GamesFolder)) {
        Write-Error "Games folder khong ton tai: $GamesFolder"
        exit 1
    }

    # Lay tat ca folders trong public/games
    $gameFolders = Get-ChildItem -Path $GamesFolder -Directory

    if ($gameFolders.Count -eq 0) {
        Write-Warning "Khong tim thay game nao trong: $GamesFolder"
        exit 1
    }

    Write-Host "Tim thay $($gameFolders.Count) game(s):" -ForegroundColor Green
    foreach ($folder in $gameFolders) {
        Write-Host "  - $($folder.Name)" -ForegroundColor Cyan
    }
    Write-Host ""

    $results = @()
    $totalSuccess = 0
    $totalFailed = 0

    # Xu ly tung game
    foreach ($gameFolder in $gameFolders) {
        $gameName = $gameFolder.Name
        $result = Process-Game -GameName $gameName
        $results += $result

        if ($result.Success) {
            $totalSuccess++
        }
        else {
            $totalFailed++
        }
    }

    # Summary
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "TONG KET" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host ""

    foreach ($result in $results) {
        $status = if ($result.Success) { "Thanh cong" } else { "Co loi" }
        $color = if ($result.Success) { "Green" } else { "Red" }
        Write-Host "$($result.GameName): $status" -ForegroundColor $color
        
        if (-not $result.Success) {
            $assetsStatus = if ($result.AssetsSuccess) { "OK" } else { "FAIL" }
            $staticStatus = if ($result.StaticSuccess) { "OK" } else { "FAIL" }
            Write-Host "  - Assets: $assetsStatus, Static: $staticStatus" -ForegroundColor Yellow
        }
    }

    Write-Host ""
    Write-Host "Tong cong: $totalSuccess thanh cong, $totalFailed loi" -ForegroundColor $(if ($totalFailed -eq 0) { "Green" } else { "Yellow" })

    if ($totalFailed -eq 0) {
        Write-Host ""
        Write-Host "Hoan thanh! Tat ca games da duoc xu ly thanh cong." -ForegroundColor Green
        exit 0
    }
    else {
        Write-Host ""
        Write-Warning "Hoan thanh voi mot so loi. Vui long kiem tra lai."
        exit 1
    }
}

# Main execution
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Setup Game Assets Script" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Kiem tra parameters
if ($All) {
    # Mode: Quet tat ca games
    Scan-AllGames
}
elseif ($GameName) {
    # Mode: Chi dinh mot game
    Write-Host "Game: $GameName" -ForegroundColor Magenta
    Write-Host ""

    $result = Process-Game -GameName $GameName

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Magenta
    Write-Host "Summary" -ForegroundColor Magenta
    Write-Host "========================================" -ForegroundColor Magenta

    $assetsStatus = if ($result.AssetsSuccess) { "Thanh cong" } else { "Co loi" }
    $staticStatus = if ($result.StaticSuccess) { "Thanh cong" } else { "Co loi" }
    $assetsColor = if ($result.AssetsSuccess) { "Green" } else { "Red" }
    $staticColor = if ($result.StaticSuccess) { "Green" } else { "Red" }

    Write-Host "Assets: $assetsStatus" -ForegroundColor $assetsColor
    Write-Host "Static: $staticStatus" -ForegroundColor $staticColor
    Write-Host ""

    if ($result.Success) {
        Write-Host "Hoan thanh! Tat ca files da duoc copy thanh cong." -ForegroundColor Green
        exit 0
    }
    else {
        Write-Warning "Hoan thanh voi mot so loi. Vui long kiem tra lai."
        exit 1
    }
}
else {
    Write-Error "Vui long chi dinh -GameName hoac -All"
    Write-Host ""
    Write-Host "Usage:" -ForegroundColor Yellow
    Write-Host "  .\setup-game-assets.ps1 -GameName `"frog-game`"" -ForegroundColor Cyan
    Write-Host "  .\setup-game-assets.ps1 -All" -ForegroundColor Cyan
    exit 1
}
