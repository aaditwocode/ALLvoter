# 🚀 QUICK START - Vercel Deployment

## ⚡ Fast Setup (5 Minutes)

### **1. Vercel Dashboard Settings** ⚠️ CRITICAL

Go to **Vercel Dashboard → Your Project → Settings → General**:

```
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### **2. Environment Variables**

Go to **Settings → Environment Variables**:

```
VITE_API_URL=https://your-backend-url.com
VITE_GEMINI_MODEL=gemini-pro
```

### **3. Commit & Push**

```bash
git add .
git commit -m "Fix Vercel deployment"
git push
```

### **4. Done!** ✅

Vercel will auto-deploy. Check the deployment logs in Vercel Dashboard.

---

## 🔍 If It Still Fails

**Check these in order:**

1. ✅ Root Directory = `frontend` (NOT root `/`)
2. ✅ Environment variables are set
3. ✅ Build works locally: `cd frontend && npm run build`
4. ✅ Check build logs in Vercel Dashboard for specific errors

---

**That's it! Everything is configured.** 🎉

