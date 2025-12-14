# Deploying to Vercel (Vite frontend)

## One-time project setup
1) Push the repo to GitHub/GitLab/Bitbucket.
2) In Vercel: **Add New Project** → import the repo.
3) Set **Root Directory** to `frontend/` (important for monorepo).
4) Vercel should auto-detect Vite. If asked:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Environment variables (Vercel → Project → Settings → Environment Variables)
Set these for Production (and Preview if you use previews):
```
VITE_API_URL=https://your-backend.example.com
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_GEMINI_MODEL=gemini-pro   # or another supported model
```

## Deploy
Click **Deploy**. Vercel will run `npm install` and `npm run build`, then serve `dist`.

## Verify
- Open the Vercel URL.
- Check the browser Network tab to confirm API calls go to your backend.
- If you see CORS errors, allow the Vercel domain on your backend.

## Notes
- Keep secrets (API keys) only in Vercel env vars—do not commit them.
- For preview deployments, add the same env vars under Preview scope.
- If you change env vars, trigger a redeploy for them to take effect.

