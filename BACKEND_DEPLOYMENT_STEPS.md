# 🚀 Backend Deployment Steps

## ✅ Frontend Status: LIVE!
Your frontend is successfully deployed at: `https://coffee-robot-a6su.vercel.app`

## 🎯 Next: Deploy Backend to Render

### Step 1: Create Render Account (1 minute)
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database (2 minutes)
1. In Render dashboard, click "New +"
2. Select "PostgreSQL"
3. Configure:
   - **Name:** `coffee-robot-db`
   - **Database:** `coffee_robot`
   - **User:** `coffee_user`
   - **Plan:** Free
4. Click "Create Database"
5. **IMPORTANT:** Copy the **Internal Database URL** (starts with `postgresql://`)

### Step 3: Deploy Backend API (3 minutes)
1. Click "New +" → "Web Service"
2. Connect your `coffee_robot` repository
3. Configure:
   ```
   Name: coffee-robot-api
   Environment: Python 3
   Root Directory: OOP barista coffee
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. **Environment Variables** (click "Advanced"):
   ```
   DATABASE_URL = <paste-your-internal-database-url-here>
   ```
5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. **Copy your API URL** (e.g., `https://coffee-robot-api.onrender.com`)

### Step 4: Update Frontend Environment (30 seconds)
1. Replace `your-render-api-url` in `frontend/.env.production` with your actual API URL
2. Commit and push:
   ```bash
   git add .
   git commit -m "Add production API URL"
   git push origin main
   ```

### Step 5: Update Backend CORS (1 minute)
1. Edit `OOP barista coffee/app/main.py`
2. Find the CORS section and update:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",
           "https://coffee-robot-a6su.vercel.app",  # Your Vercel URL
           "https://*.vercel.app"
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Commit and push to trigger backend redeploy

## 🎉 Final Result
- **Frontend:** https://coffee-robot-a6su.vercel.app
- **Backend:** https://your-api.onrender.com
- **Database:** PostgreSQL on Render

## 🧪 Test Your Live System
1. Visit your Vercel URL
2. Try customer registration
3. Browse menu and add to cart
4. Test payment system
5. Try admin menu management

## ⚠️ Important Notes
- **First API call:** May take 30-60 seconds (free tier wakes up)
- **Database:** Free tier expires after 90 days (renewable)
- **Updates:** Push to GitHub auto-deploys both services

## 🆘 If You Need Help
- **Render Logs:** Dashboard → Your service → Logs tab
- **Vercel Logs:** Dashboard → Deployments → View logs
- **Database:** Check connection in Render PostgreSQL dashboard