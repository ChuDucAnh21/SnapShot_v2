# 🚀 Iruka Next.js 15 - Firebase + Cloud Run Deployment

This guide covers containerizing and deploying your Next.js 15 application to Firebase using Cloud Run for optimal performance and scalability.

## 📋 Prerequisites

- Node.js 20+ (already configured in package.json)
- Docker & Docker Compose
- Google Cloud CLI (`gcloud`)
- Firebase CLI (`firebase`)
- pnpm (managed via Corepack)

## 🏗️ Architecture

```
Firebase Hosting (CDN/SSL) → Cloud Run (Next.js Container) → Your App
```

- **Firebase Hosting**: CDN, SSL certificates, custom domains
- **Cloud Run**: Serverless container platform for Next.js app
- **Artifact Registry**: Docker image storage

## 🐳 Local Development with Docker

### Quick Start

```bash
# Build and run locally
./scripts/deployment/dev-docker.sh

# Or manually
docker-compose up --build
```

Your app will be available at `http://localhost:8080`

### Cleanup

```bash
./scripts/deployment/cleanup-docker.sh
```

## 🚀 Production Deployment

### 1. Initial Setup

```bash
# Login to Google Cloud
gcloud auth login

# Login to Firebase
firebase login

# Set your project ID in .firebaserc
# Update firebase.json with your site ID
```

### 2. Deploy Everything

```bash
# Deploy to production
./scripts/deployment/deploy.sh your-project-id iruka-next15

# Or manually step by step:
```

### 3. Manual Deployment Steps

#### Step 1: Build & Push Docker Image

```bash
# Set project
gcloud config set project YOUR_PROJECT_ID

# Create Artifact Registry repository (first time only)
gcloud artifacts repositories create web-images \
  --repository-format=docker --location=asia-southeast1

# Build and push image
gcloud builds submit --tag \
  asia-southeast1-docker.pkg.dev/YOUR_PROJECT_ID/web-images/iruka-next15:latest
```

#### Step 2: Deploy to Cloud Run

```bash
gcloud run deploy iruka-next15 \
  --image=asia-southeast1-docker.pkg.dev/YOUR_PROJECT_ID/web-images/iruka-next15:latest \
  --platform=managed --region=asia-southeast1 --allow-unauthenticated \
  --port=8080 --memory=512Mi --cpu=1
```

#### Step 3: Deploy Firebase Hosting

```bash
firebase use YOUR_PROJECT_ID
firebase deploy --only hosting
```

## ⚙️ Configuration Files

### `next.config.ts`
- Added `output: 'standalone'` for optimized Docker builds
- Maintains existing i18n and bundle analyzer configuration

### `Dockerfile`
- Multi-stage build with pnpm optimization
- Uses Corepack for stable pnpm installation
- Optimized caching with `pnpm fetch`
- Non-root user for security
- Standalone Next.js output

### `docker-compose.yaml`
- Local development setup
- Port mapping: `8080:8080`
- Production environment variables

### `firebase.json`
- Hosting configuration
- Rewrites all traffic to Cloud Run service
- Update `site` field with your Firebase site ID

### `.firebaserc`
- Project configuration
- Update with your actual project IDs

## 🔧 Environment Variables

### Build-time Variables
Set these in your build environment or Cloud Build:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-api.com
NEXT_PUBLIC_APP_ENV=production
```

### Runtime Variables
Set these in Cloud Run console or via CLI:

```bash
# Database
DATABASE_URL=your-database-url

# API Keys
API_SECRET_KEY=your-secret-key

# Other runtime configs
NODE_ENV=production
```

## 📊 Performance Optimizations

### Docker Image
- **Multi-stage build**: Reduces final image size
- **pnpm fetch + offline install**: Faster, deterministic builds
- **Standalone output**: Only includes necessary files
- **Non-root user**: Security best practice

### Cloud Run
- **Memory**: 512Mi (adjust based on your app needs)
- **CPU**: 1 vCPU
- **Auto-scaling**: 0-10 instances
- **Cold start**: Optimized with standalone build

### Firebase Hosting
- **CDN**: Global edge caching
- **SSL**: Automatic HTTPS
- **Custom domains**: Easy setup

## 🔍 Monitoring & Debugging

### Cloud Run Logs
```bash
gcloud logs read --service=iruka-next15 --region=asia-southeast1
```

### Firebase Hosting Analytics
- Available in Firebase Console
- Real-time traffic monitoring

### Health Checks
- Cloud Run automatically health checks on `/`
- Next.js app responds to health checks by default

## 🛠️ Troubleshooting

### Common Issues

1. **Build fails with pnpm**
   ```bash
   # Ensure Corepack is enabled
   corepack enable
   ```

2. **Image too large**
   - Check `.dockerignore` includes all unnecessary files
   - Verify multi-stage build is working correctly

3. **Cloud Run deployment fails**
   - Check service name matches `firebase.json`
   - Verify region consistency

4. **Firebase Hosting not routing**
   - Update `firebase.json` with correct service ID
   - Ensure Cloud Run service is public

### Debug Commands

```bash
# Test Docker build locally
docker build -t iruka-test .

# Check Cloud Run service status
gcloud run services describe iruka-next15 --region=asia-southeast1

# View Firebase Hosting configuration
firebase hosting:channel:list
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Deploy to Firebase + Cloud Run
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: google-github-actions/setup-gcloud@v2
      - run: ./scripts/deploy.sh ${{ secrets.GCP_PROJECT_ID }}
```

## 📈 Scaling Considerations

- **Cloud Run**: Auto-scales based on traffic
- **Firebase Hosting**: Handles CDN scaling automatically
- **Database**: Consider connection pooling for high traffic
- **Monitoring**: Set up alerts for error rates and latency

## 🔐 Security Best Practices

- ✅ Non-root Docker user
- ✅ Environment variables for secrets
- ✅ Firebase Security Rules
- ✅ Cloud Run IAM permissions
- ✅ HTTPS enforcement via Firebase Hosting

---

## 📚 Additional Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/app/getting-started/deploying)
- [Cloud Run Next.js Guide](https://cloud.google.com/run/docs/quickstarts/frameworks/deploy-nextjs-service)
- [Firebase Hosting Configuration](https://firebase.google.com/docs/hosting/full-config)
- [pnpm Docker Guide](https://pnpm.io/docker)

---

**Ready to deploy?** Run `./scripts/deployment/deploy.sh your-project-id` and your Iruka app will be live! 🎉
