# Railway Deployment Guide for Coffee Shop App

## Prerequisites
- GitHub account with your code pushed
- Railway account (sign up at railway.app)

## Step 1: Prepare Your Repository

1. **Commit all changes:**
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy to Railway

### 2.1 Create New Project
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Choose your coffee shop repository

### 2.2 Add PostgreSQL Database
1. In your Railway project dashboard
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway will automatically create a PostgreSQL instance
4. Note: DATABASE_URL will be automatically provided as environment variable

### 2.3 Configure Environment Variables
In your Railway project settings, add these environment variables:

**For the main service:**
- `PORT` = `8000` (Railway will override this automatically)
- `RAILWAY_ENVIRONMENT` = `production`

**Database variables (automatically provided by Railway PostgreSQL service):**
- `DATABASE_URL` (automatically set by Railway)
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` (auto-generated)

### 2.4 Update Frontend API URL
After deployment, update your frontend environment:

1. Get your Railway app URL (something like `https://your-app-name.railway.app`)
2. Update `frontend/.env.production`:
```
REACT_APP_API_URL=https://your-actual-railway-url.railway.app
```
3. Commit and push changes

## Step 3: Deployment Process

Railway will automatically:
1. Detect your `nixpacks.toml` configuration
2. Install Python and Node.js dependencies
3. Build the React frontend
4. Start the FastAPI backend
5. Connect to the PostgreSQL database

## Step 4: Database Setup

The database tables will be created automatically when the app starts, thanks to the CREATE TABLE IF NOT EXISTS statements in your code.

## Step 5: Testing

1. Visit your Railway app URL
2. Test the API endpoints: `https://your-app.railway.app/docs`
3. Test the frontend functionality
4. Check database connections

## Step 6: Custom Domain (Optional)

1. In Railway project settings
2. Go to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update CORS settings in `main.py` if needed

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check Railway build logs
   - Ensure all dependencies are in requirements.txt
   - Verify nixpacks.toml configuration

2. **Database Connection Issues:**
   - Verify PostgreSQL service is running
   - Check DATABASE_URL environment variable
   - Review connection logs

3. **CORS Errors:**
   - Update allowed origins in main.py
   - Add your Railway domain to CORS settings

4. **Frontend Not Loading:**
   - Check if build completed successfully
   - Verify static file serving in main.py
   - Check frontend build output

### Useful Commands:

```bash
# Check Railway CLI status
railway status

# View logs
railway logs

# Connect to database
railway connect postgres
```

## Environment Variables Summary

**Automatically provided by Railway:**
- `DATABASE_URL`
- `PORT`
- `RAILWAY_ENVIRONMENT`

**You need to set:**
- Update `REACT_APP_API_URL` in frontend/.env.production

## File Structure for Railway:
```
project-root/
├── nixpacks.toml          # Build configuration
├── railway.json           # Railway settings
├── Procfile              # Process definition
├── OOP barista coffee/   # Backend
│   ├── requirements.txt
│   └── app/
└── frontend/             # Frontend
    ├── package.json
    └── build/           # Generated after build
```

## Cost Estimation:
- **Hobby Plan**: $5/month (includes PostgreSQL)
- **Pro Plan**: $20/month (better performance)

Railway provides $5 free credit monthly for hobby projects.

## Next Steps After Deployment:
1. Test all functionality
2. Set up monitoring
3. Configure custom domain
4. Set up CI/CD if needed
5. Monitor usage and costs

Your coffee shop app will be live at: `https://your-project-name.railway.app`