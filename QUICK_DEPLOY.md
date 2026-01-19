# 🚀 Quick Deploy Guide (5 Minutes)

## Step 1: Backend (Render) - 3 minutes

### 1.1 Create Account & Database
1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "PostgreSQL"
3. Name: `coffee-robot-db`, Plan: Free → Create
4. **Copy the Internal Database URL** (starts with `postgresql://`)

### 1.2 Deploy API
1. Click "New +" → "Web Service"
2. Connect `coffee_robot` repo
3. Settings:
   ```
   Name: coffee-robot-api
   Environment: Python 3
   Root Directory: OOP barista coffee
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
4. Environment Variables:
   ```
   DATABASE_URL = <paste-your-database-url>
   ```
5. Click "Create Web Service"
6. **Copy your API URL** (e.g., `https://coffee-robot-api.onrender.com`)

---

## Step 2: Frontend (Vercel) - 2 minutes

### 2.1 Create Account & Deploy
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New..." → "Project"
3. Import `coffee_robot` repository
4. Settings:
   ```
   Framework: Create React App
   Root Directory: frontend
   ```
5. Environment Variables:
   ```
   REACT_APP_API_URL = <paste-your-api-url>
   ```
6. Click "Deploy"
7. **Copy your frontend URL** (e.g., `https://coffee-robot-xyz.vercel.app`)

---

## Step 3: Update CORS (30 seconds)

1. In your local code, edit `OOP barista coffee/app/main.py`
2. Find the CORS section and update:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=[
           "http://localhost:3000",
           "https://your-vercel-url.vercel.app",  # Replace with your actual URL
           "https://*.vercel.app"
       ],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Update CORS for production"
   git push origin main
   ```

Both services will auto-redeploy in 1-2 minutes.

---

## ✅ Test Your Live App

Visit your Vercel URL and test:
- [ ] Role selection works
- [ ] Customer registration works
- [ ] Menu browsing works
- [ ] Cart and payment work
- [ ] Admin menu management works

---

## 🎉 You're Live!

**Frontend:** `https://your-app.vercel.app`
**Backend:** `https://your-api.onrender.com`

Share your URL with friends! ☕🚀

---

## ⚠️ Important Notes

1. **First Load:** Backend may take 30-60 seconds to wake up (free tier sleeps)
2. **Database:** Free PostgreSQL expires after 90 days (renewable)
3. **Updates:** Just push to GitHub - both services auto-deploy
4. **Logs:** Check Render/Vercel dashboards if issues occur

---

## 🆙 Upgrade Options

**For Production Use:**
- Render Starter: $7/month (no sleep, better performance)
- Vercel Pro: $20/month (better analytics, more bandwidth)
- PostgreSQL Starter: $7/month (persistent, more storage)

**Total Production Cost:** ~$34/month for always-on, production-ready setup.