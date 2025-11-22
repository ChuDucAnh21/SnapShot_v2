# 📁 Scripts Directory

This directory contains various utility scripts for the Iruka Next.js 15 project.

## 📂 Directory Structure

```
scripts/
├── deployment/          # Deployment and Docker scripts
│   ├── deploy.sh        # Production deployment (Bash)
│   ├── deploy.ps1       # Production deployment (PowerShell)
│   ├── dev-docker.sh    # Local Docker development (Bash)
│   ├── dev-docker.ps1   # Local Docker development (PowerShell)
│   ├── cleanup-docker.sh # Docker cleanup (Bash)
│   └── cleanup-docker.ps1 # Docker cleanup (PowerShell)
└── check-atom-margins.mjs # Atom component margin checker
```

## 🚀 Deployment Scripts

All deployment-related scripts are located in the `deployment/` subdirectory:

### Production Deployment
- **`deploy.sh`** / **`deploy.ps1`** - Deploy to Firebase + Cloud Run
- **`dev-docker.sh`** / **`dev-docker.ps1`** - Local Docker development
- **`cleanup-docker.sh`** / **`cleanup-docker.ps1`** - Clean up Docker resources

### Usage Examples

#### Windows (PowerShell)
```powershell
# Deploy to production
.\scripts\deployment\deploy.ps1 -ProjectId "your-project-id"

# Local development
.\scripts\deployment\dev-docker.ps1

# Cleanup
.\scripts\deployment\cleanup-docker.ps1
```

#### Linux/Mac (Bash)
```bash
# Deploy to production
./scripts/deployment/deploy.sh your-project-id

# Local development
./scripts/deployment/dev-docker.sh

# Cleanup
./scripts/deployment/cleanup-docker.sh
```

## 🔧 Development Scripts

- **`check-atom-margins.mjs`** - Validates atom component margins according to design system guidelines

## 📚 Documentation

For detailed deployment instructions, see:
- [`docs/deployment/DEPLOYMENT.md`](../docs/deployment/DEPLOYMENT.md)

## 🛠️ Prerequisites

Before running deployment scripts, ensure you have:
- Docker & Docker Compose
- Google Cloud CLI (`gcloud`)
- Firebase CLI (`firebase`)
- Node.js 20+ with pnpm

## 🔐 Security Note

All scripts are designed to run safely with proper error handling and validation. Always review script contents before execution in production environments.
