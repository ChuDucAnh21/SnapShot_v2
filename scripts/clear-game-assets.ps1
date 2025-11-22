# PowerShell script de xoa het files va folders trong public/assets va public/static
# Usage: .\clear-game-assets.ps1

param(
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Duong dan goc cua project (tu scripts/ folder)
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Duong dan destination
$PublicAssetsPath = Join-Path $ProjectRoot "public\assets"
$PublicStaticPath = Join-Path $ProjectRoot "public\static"

# Function de xoa folder
function Clear-Folder {
    param(
        [string]$FolderPath,
        [string]$Type
    )

    if (-not (Test-Path $FolderPath)) {
        Write-Warning "[$Type] Folder khong ton tai: $FolderPath"
        return @{ Success = $true; DeletedCount = 0 }
    }

    $deletedCount = 0
    $errorCount = 0

    try {
        # Lay tat ca items trong folder
        $items = Get-ChildItem -Path $FolderPath -Recurse -Force -ErrorAction SilentlyContinue
        $totalItems = ($items | Measure-Object).Count

        if ($totalItems -eq 0) {
            Write-Host "[$Type] Folder rong, khong co gi de xoa" -ForegroundColor Yellow
            return @{ Success = $true; DeletedCount = 0 }
        }

        Write-Host "[$Type] Tim thay $totalItems items trong folder..." -ForegroundColor Cyan

        # Xoa tat ca items
        foreach ($item in $items) {
            try {
                Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction Stop
                $deletedCount++
            }
            catch {
                Write-Warning "[$Type] Khong the xoa: $($item.FullName)"
                $errorCount++
            }
        }

        # Xoa cac folder con rong (neu con)
        $folders = Get-ChildItem -Path $FolderPath -Directory -Recurse -Force -ErrorAction SilentlyContinue | Sort-Object FullName -Descending
        foreach ($folder in $folders) {
            try {
                $folderItems = Get-ChildItem -Path $folder.FullName -Force -ErrorAction SilentlyContinue
                if ($folderItems.Count -eq 0) {
                    Remove-Item -Path $folder.FullName -Force -ErrorAction Stop
                }
            }
            catch {
                # Ignore errors khi xoa folder rong
            }
        }

        # Xoa cac items o root level
        $rootItems = Get-ChildItem -Path $FolderPath -Force -ErrorAction SilentlyContinue
        foreach ($item in $rootItems) {
            try {
                Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction Stop
            }
            catch {
                Write-Warning "[$Type] Khong the xoa: $($item.FullName)"
                $errorCount++
            }
        }

        $color = if ($errorCount -eq 0) { "Green" } else { "Yellow" }
        Write-Host "[$Type] Hoan thanh: $deletedCount items da xoa, $errorCount loi" -ForegroundColor $color

        return @{
            Success = $errorCount -eq 0
            DeletedCount = $deletedCount
            ErrorCount = $errorCount
        }
    }
    catch {
        Write-Error "[$Type] Loi khi xoa folder: $_"
        return @{
            Success = $false
            DeletedCount = $deletedCount
            ErrorCount = $errorCount + 1
        }
    }
}

# Main execution
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "Clear Game Assets Script" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

# Hien thi thong tin
Write-Host "Cac folder se duoc xoa:" -ForegroundColor Yellow
Write-Host "  - $PublicAssetsPath" -ForegroundColor Cyan
Write-Host "  - $PublicStaticPath" -ForegroundColor Cyan
Write-Host ""

# Confirmation
if (-not $Force) {
    $confirmation = Read-Host "Ban co chac chan muon xoa het files trong cac folder nay? (y/N)"
    if ($confirmation -ne "y" -and $confirmation -ne "Y") {
        Write-Host "Da huy." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Bat dau xoa..." -ForegroundColor Yellow
Write-Host ""

# Xoa assets folder
Write-Host "[ASSETS] Dang xoa noi dung trong public/assets..." -ForegroundColor Yellow
$assetsResult = Clear-Folder -FolderPath $PublicAssetsPath -Type "ASSETS"
Write-Host ""

# Xoa static folder
Write-Host "[STATIC] Dang xoa noi dung trong public/static..." -ForegroundColor Yellow
$staticResult = Clear-Folder -FolderPath $PublicStaticPath -Type "STATIC"
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Magenta
Write-Host "TONG KET" -ForegroundColor Magenta
Write-Host "========================================" -ForegroundColor Magenta
Write-Host ""

$assetsStatus = if ($assetsResult.Success) { "Thanh cong" } else { "Co loi" }
$staticStatus = if ($staticResult.Success) { "Thanh cong" } else { "Co loi" }
$assetsColor = if ($assetsResult.Success) { "Green" } else { "Red" }
$staticColor = if ($staticResult.Success) { "Green" } else { "Red" }

Write-Host "Assets: $assetsStatus ($($assetsResult.DeletedCount) items da xoa)" -ForegroundColor $assetsColor
Write-Host "Static: $staticStatus ($($staticResult.DeletedCount) items da xoa)" -ForegroundColor $staticColor
Write-Host ""

$totalDeleted = $assetsResult.DeletedCount + $staticResult.DeletedCount
$totalErrors = $assetsResult.ErrorCount + $staticResult.ErrorCount

if ($totalErrors -eq 0) {
    Write-Host "Hoan thanh! Da xoa $totalDeleted items thanh cong." -ForegroundColor Green
    exit 0
}
else {
    Write-Warning "Hoan thanh voi $totalErrors loi. Vui long kiem tra lai."
    exit 1
}

