# 🔧 Vercel Deployment Fix

## ❌ Problem
Build error: `Build "src" is "vite.config.js" but expected "package.json" or "build.sh"`

This happens because the old `vercel.json` used deprecated `builds` array format.

## ✅ Solution Applied

Updated `frontend/vercel.json` to use modern Vercel configuration format.

**Old (Deprecated):**
```json
{
  "builds": [
    {
      "src": "vite.config.js",
      "use": "@vercel/static-build",
      ...
    }
  ]
}
```

**New (Modern):**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "installCommand": "npm install"
}
```

---

## 📋 Vercel Project Settings Checklist

### **Option 1: Using vercel.json (Recommended)**

1. ✅ **Root Directory**: Set to `frontend` in Vercel Dashboard
   - Go to Project Settings → General
   - Set "Root Directory" to `frontend`

2. ✅ **Framework Preset**: Should auto-detect as "Vite" (or set manually)

3. ✅ **Build Settings**: 
   - Build Command: `npm run build` (or leave default)
   - Output Directory: `dist` (or leave default)
   - Install Command: `npm install` (or leave default)

4. ✅ **Environment Variables**: Add these in Vercel Dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_GEMINI_MODEL=gemini-pro
   ```
   (Note: GEMINI_API_KEY is now on backend, not needed here)

### **Option 2: Without vercel.json (Also Works)**

If you prefer, you can delete `vercel.json` and configure everything in Vercel Dashboard:

1. Delete `frontend/vercel.json`
2. In Vercel Dashboard:
   - Root Directory: `frontend`
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

---

## 🚀 Deployment Steps

1. **Commit and Push**:
   ```bash
   git add frontend/vercel.json
   git commit -m "Fix Vercel deployment configuration"
   git push
   ```

2. **Vercel will automatically redeploy** (if connected to Git)

3. **Or manually redeploy** in Vercel Dashboard

---

## ✅ Verification

After deployment, check:
- ✅ Build succeeds (no errors)
- ✅ Site is accessible
- ✅ Frontend connects to backend API
- ✅ Chatbot works (if backend is deployed)

---

## 🔍 If Build Still Fails

### Check Root Directory
- Go to Vercel Dashboard → Settings → General
- Ensure "Root Directory" is set to `frontend` (not root `/`)

### Check Build Logs
- Look for any npm install errors
- Check if all dependencies are in `package.json`
- Verify Node.js version (should be 18+)

### Manual Build Test
Test locally before deploying:
```bash
cd frontend
npm install
npm run build
```
If this works, Vercel should work too.

---

## 📝 Notes

- The `vercel.json` is now simplified and uses modern format
- Vercel auto-detects Vite projects, so minimal config is needed
- Environment variables must be set in Vercel Dashboard (not in .env file)
- The backend needs to be deployed separately (or use your existing backend URL)

---

**The fix is complete! Push the updated `vercel.json` and Vercel should build successfully.** ✅

