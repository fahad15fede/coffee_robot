# Vercel Deployment Guide - Coffee Robot System

## Prerequisites
- GitHub account with `coffee_robot` repository
- Vercel account (free tier works fine)

## Part 1: Deploy Frontend to Vercel

### Step 1: Sign Up / Login to Vercel
1. Go to https://vercel.com
2. Click "Sign Up" or "Login"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project
1. Once logged in, click "Add New..." → "Project"
2. You'll see a list of your GitHub repositories
3. Find `coffee_robot` and click "Import"

### Step 3: Configure Project Settings
When the import screen appears:

**Framework Preset:** Create React App (should auto-detect)

**Root Directory:** Click "Edit" and select `frontend` folder

**Build Settings:**
- Build Command: `npm run build` (auto-filled)
- Output Directory: `build` (auto-filled)
- Install Command: `npm install` (auto-filled)

**Environment Variables:** (Add these if needed)
- Click "Add" to add environment variables
- For now, leave empty (we'll configure API later)

### Step 4: Deploy
1. Click "Deploy" button
2. Wait 2-3 minutes for build to complete
3. You'll see a success screen with your live URL
4. Example: `https://coffee-robot-xyz123.vercel.app`

### Step 5: Test Your Frontend
1. Click on the deployment URL
2. Your Coffee Robot website should load
3. Note: Backend API calls will fail until we deploy the backend

---

## Part 2: Deploy Backend (FastAPI) - Options

### Option A: Deploy Backend to Render (Recommended)

#### Step 1: Prepare Backend
1. Create `requirements.txt` in `OOP barista coffee` folder:
```txt
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
```

2. Create `render.yaml` in root:
```yaml
services:
  - type: web
    name: coffee-robot-api
    env: python
    buildCommand: "pip install -r 'OOP barista coffee/requirements.txt'"
    startCommand: "cd 'OOP barista coffee' && uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
```

#### Step 2: Deploy to Render
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your `coffee_robot` repository
5. Configure:
   - Name: `coffee-robot-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r "OOP barista coffee/requirements.txt"`
   - Start Command: `cd "OOP barista coffee" && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your API URL: `https://coffee-robot-api.onrender.com`

### Option B: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `coffee_robot`
5. Add these settings:
   - Root Directory: `OOP barista coffee`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Deploy and copy the URL

### Option C: Keep Backend Local (Development Only)
- Run backend locally: `uvicorn app.main:app --reload`
- Use ngrok to expose: `ngrok http 8000`
- Update frontend API URL to ngrok URL

---

## Part 3: Connect Frontend to Backend

### Step 1: Update API URL in Frontend
You need to update the API base URL in your frontend components.

**Files to update:**
- `frontend/src/components/customer/EnhancedMenuBrowse.js`
- `frontend/src/components/customer/CustomerRegistrationNew.js`
- `frontend/src/components/customer/CustomerDashboard.js`
- `frontend/src/components/customer/MyOrders.js`
- `frontend/src/components/customer/PaymentModal.js`
- `frontend/src/components/admin/AdminApp.js`
- `frontend/src/components/admin/OrderManagement.js`
- `frontend/src/components/MenuManagement.js`

**Change from:**
```javascript
const API_BASE_URL = 'http://localhost:8000';
```

**Change to:**
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.onrender.com';
```

### Step 2: Add Environment Variable in Vercel
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add new variable:
   - Name: `REACT_APP_API_URL`
   - Value: `https://your-backend-url.onrender.com`
   - Environment: Production, Preview, Development (select all)
4. Click "Save"

### Step 3: Redeploy Frontend
1. Go to "Deployments" tab in Vercel
2. Click "..." on latest deployment → "Redeploy"
3. Or push a new commit to GitHub (auto-deploys)

### Step 4: Update Backend CORS
Update `OOP barista coffee/app/main.py` to allow your Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://your-vercel-app.vercel.app",  # Add your Vercel URL
        "https://*.vercel.app"  # Allow all Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Part 4: Database Setup for Production

### Option 1: SQLite (Simple, but limited)
- Your current setup works
- Database file stored on server
- **Warning:** Render/Railway may reset database on redeploy

### Option 2: PostgreSQL (Recommended for Production)
1. Create free PostgreSQL database:
   - Render: Built-in PostgreSQL
   - Railway: Built-in PostgreSQL
   - Supabase: Free tier
   - ElephantSQL: Free tier

2. Update your database connection in `database.py`
3. Install `psycopg2`: Add to requirements.txt

---

## Quick Commands Summary

### Push changes to GitHub (auto-deploys to Vercel):
```bash
git add .
git commit -m "Update for production"
git push origin main
```

### Test locally before deploying:
```bash
# Backend
cd "OOP barista coffee"
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm start
```

### Build frontend locally to test:
```bash
cd frontend
npm run build
npm install -g serve
serve -s build
```

---

## Troubleshooting

### Frontend builds but shows blank page:
- Check browser console for errors
- Verify API_BASE_URL is correct
- Check CORS settings in backend

### API calls failing:
- Verify backend is running (visit backend URL)
- Check CORS configuration
- Verify environment variables in Vercel

### Build fails on Vercel:
- Check build logs in Vercel dashboard
- Verify all dependencies in package.json
- Ensure no missing files

### Database not persisting:
- Use external database (PostgreSQL)
- Or use Render's persistent disk feature

---

## Your URLs After Deployment

**Frontend (Vercel):** `https://coffee-robot-[random].vercel.app`
**Backend (Render):** `https://coffee-robot-api.onrender.com`

**Custom Domain (Optional):**
- Buy domain from Namecheap/GoDaddy
- Add to Vercel: Settings → Domains
- Follow DNS configuration steps

---

## Cost Breakdown

**Free Tier (Recommended for testing):**
- Vercel: Free (100GB bandwidth/month)
- Render: Free (750 hours/month, sleeps after 15 min inactivity)
- Total: $0/month

**Paid Tier (For production):**
- Vercel Pro: $20/month (better performance)
- Render Starter: $7/month (always-on backend)
- Total: $27/month

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ✅ Connect them with environment variables
4. ✅ Test all features
5. ✅ Share your live URL!

Need help? Check the logs in Vercel/Render dashboards.
