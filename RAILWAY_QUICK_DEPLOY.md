# Quick Railway Deployment

## 🚀 One-Click Deploy Steps:

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Click "Deploy from GitHub repo"
3. Select your repository
4. Add PostgreSQL database service
5. Wait for deployment

### 3. Update Frontend URL
After deployment, get your Railway URL and update:
```bash
# Edit frontend/.env.production
REACT_APP_API_URL=https://your-railway-url.railway.app
```

### 4. Redeploy
```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push origin main
```

## ✅ What's Already Configured:
- ✅ Railway configuration files
- ✅ Database environment variables
- ✅ CORS settings for production
- ✅ Static file serving
- ✅ Build configuration
- ✅ Process definition

## 🎯 Your app will be live at:
`https://your-project-name.railway.app`

## 💰 Cost:
- Free tier: $5 credit/month
- Hobby: $5/month
- Includes PostgreSQL database

## 🔧 Files Created:
- `railway.json` - Railway configuration
- `nixpacks.toml` - Build settings
- `Procfile` - Process definition
- `deploy-railway.bat` - Deployment script
- Updated CORS and database configs

Ready to deploy! 🚀