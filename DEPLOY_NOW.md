# 🚀 Deploy Coffee Robot to Vercel - Quick Steps

## Frontend Deployment (5 minutes)

### 1. Go to Vercel
- Visit: https://vercel.com
- Click "Sign Up" → "Continue with GitHub"

### 2. Import Project
- Click "Add New..." → "Project"
- Find `coffee_robot` repository
- Click "Import"

### 3. Configure
- **Root Directory:** Click "Edit" → Select `frontend`
- **Framework:** Create React App (auto-detected)
- Leave everything else as default

### 4. Deploy
- Click "Deploy" button
- Wait 2-3 minutes
- Copy your URL: `https://coffee-robot-xyz.vercel.app`

✅ **Frontend is now LIVE!**

---

## Backend Deployment (10 minutes)

### Option 1: Render (Recommended - Free)

#### 1. Go to Render
- Visit: https://render.com
- Sign up with GitHub

#### 2. Create Web Service
- Click "New +" → "Web Service"
- Connect `coffee_robot` repository

#### 3. Configure
```
Name: coffee-robot-api
Environment: Python 3
Build Command: pip install -r "OOP barista coffee/requirements.txt"
Start Command: cd "OOP barista coffee" && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

#### 4. Deploy
- Click "Create Web Service"
- Wait 5-10 minutes
- Copy your API URL: `https://coffee-robot-api.onrender.com`

✅ **Backend is now LIVE!**

---

## Connect Frontend to Backend

### 1. Update Backend CORS
Edit `OOP barista coffee/app/main.py`:

Find this section:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
```

Change to:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-url.vercel.app",  # Your actual Vercel URL
        "https://*.vercel.app"
    ],
```

### 2. Create Environment File
Create `frontend/.env.production`:
```
REACT_APP_API_URL=https://coffee-robot-api.onrender.com
```

### 3. Update API URLs
In all frontend files, change:
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

To:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

### 4. Push Changes
```bash
git add .
git commit -m "Configure for production deployment"
git push origin main
```

Vercel will auto-deploy in 2 minutes!

---

## Test Your Live App

1. Visit your Vercel URL
2. Try registering a customer
3. Browse menu and place order
4. Test admin panel

---

## Important Notes

⚠️ **Render Free Tier:** Backend sleeps after 15 minutes of inactivity. First request after sleep takes 30-60 seconds to wake up.

💡 **Tip:** For always-on backend, upgrade to Render Starter ($7/month)

🎉 **You're Live!** Share your URL with friends!

---

## Need Help?

Check logs:
- **Vercel:** Dashboard → Deployments → Click deployment → View Function Logs
- **Render:** Dashboard → Your service → Logs tab

Common issues in `VERCEL_DEPLOYMENT_GUIDE.md`
