Param(
  [string]$ProjectId = "noted-aloe-474810-u1",   # e.g. iruka-prod
  [string]$Region    = "asia-southeast1",       # e.g. us-central1 or asia-southeast1
  [string]$BackendId = "iruka-app-frontend"
)

$Secrets = @(
  "NODE_ENV",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "NEXT_PUBLIC_POSTHOG_KEY",
  "NEXT_PUBLIC_POSTHOG_HOST",
  "DATABASE_URL",
  "NEXT_TELEMETRY_DISABLED",
  "ARCJET_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_SENTRY_DISABLED",
  "NEXT_PUBLIC_API_BASE_URL",
  "NEXT_PUBLIC_USE_MOCK_DATA",
  "NEXT_PUBLIC_ALLOWED_GAME_ORIGINS"
)

Write-Host "Granting App Hosting backend '$BackendId' access to $($Secrets.Count) secrets..."

foreach ($name in $Secrets) {
  Write-Host "→ $name"
  $args = @("apphosting:secrets:grantaccess", $name, "--backend", $BackendId)
  if ($ProjectId -and $ProjectId -ne "<YOUR_PROJECT_ID>") { $args += @("--project", $ProjectId) }
  if ($Region -and $Region -ne "<YOUR_REGION>") { $args += @("--location", $Region) }
  firebase @args
}

Write-Host "✅ Done. Ensure your apphosting.yaml maps 'variable' -> 'secret' for each."
