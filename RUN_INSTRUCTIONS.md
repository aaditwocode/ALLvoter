# 🚀 How to Run ALLvoter - Complete Guide

## Prerequisites

Before starting, ensure you have:
- ✅ Node.js (v16 or higher) installed
- ✅ MongoDB database running (local or cloud)
- ✅ Google Gemini API key (optional, for chatbot)

## Step 1: Backend Setup

### 1.1 Install Backend Dependencies

Open a terminal in the **root directory** (`C:\PROJECTS\ALLvoter`):

```bash
npm install
```

### 1.2 Configure Backend Environment

Create a `.env` file in the **root directory** with:

```env
MONGODB_URL=mongodb://localhost:27017/allvoter
# OR use MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/allvoter

JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=3000
```

**Important:** 
- Replace `MONGODB_URL` with your actual MongoDB connection string
- Replace `JWT_SECRET` with a strong random string (at least 32 characters)

### 1.3 Start Backend Server

```bash
npm start
```

**OR** for development with auto-reload:

```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB server
listening on port 3000
```

✅ **Backend is now running on `http://localhost:3000`**

---

## Step 2: Frontend Setup

### 2.1 Navigate to Frontend Directory

Open a **NEW terminal** and navigate to the frontend folder:

```bash
cd frontend
```

### 2.2 Install Frontend Dependencies

```bash
npm install
```

### 2.3 Configure Frontend Environment

Create a `.env` file in the `frontend` directory:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_API_URL=http://localhost:3000
```

**Note:** 
- Get your Gemini API key from: https://makersuite.google.com/app/apikey
- If you don't have a Gemini API key, the chatbot won't work but the rest of the app will function

### 2.4 Start Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

✅ **Frontend is now running on `http://localhost:5173`**

---

## Step 3: Access the Application

1. **Open your browser** and go to: `http://localhost:5173`

2. **You should see the Login page** with Indian-themed design

3. **Create an account:**
   - Click "Sign Up"
   - Fill in the form (Aadhar Card Number must be 12 digits)
   - First user with `role: 'admin'` in signup form will be admin
   - Click "Sign Up"

4. **Login:**
   - Use your Aadhar Card Number and password
   - You'll be redirected to the Dashboard

---

## Step 4: Testing the Application

### For Regular Users (Voters):

1. ✅ **View Candidates:** Click "View Candidates" or navigate to `/candidates`
2. ✅ **Vote:** Click "Vote" button on any candidate (only once)
3. ✅ **View Vote Count:** Navigate to "Vote Count" to see live results
4. ✅ **Profile:** Update your profile and change password
5. ✅ **Chatbot:** Click the 💬 icon (bottom-right) to use AI assistant

### For Admins:

1. ✅ **Admin Panel:** Navigate to "Admin Panel" from dashboard
2. ✅ **Add Candidate:** Click "+ Add Candidate" and fill the form
3. ✅ **Edit Candidate:** Click "Edit" on any candidate
4. ✅ **Delete Candidate:** Click "Delete" on any candidate
5. ✅ **View All:** See all candidates with vote counts

---

## Troubleshooting

### Backend Issues:

**❌ "MongoDB connection error"**
- Check if MongoDB is running
- Verify `MONGODB_URL` in `.env` is correct
- For MongoDB Atlas, ensure your IP is whitelisted

**❌ "Port 3000 already in use"**
- Change `PORT` in `.env` to another port (e.g., 3001)
- Update `VITE_API_URL` in frontend `.env` accordingly

**❌ "JWT_SECRET is not set"**
- Make sure `.env` file exists in root directory
- Add `JWT_SECRET=your_secret_key` to `.env`

### Frontend Issues:

**❌ "Failed to fetch" or CORS errors**
- Ensure backend is running on port 3000
- Check CORS settings in `server.js` (should already be configured)
- Verify `VITE_API_URL` in frontend `.env`

**❌ "Cannot connect to API"**
- Check if backend server is running
- Open browser DevTools (F12) → Network tab to see API calls
- Verify API URL is correct

**❌ Chatbot not working**
- Check if `VITE_GEMINI_API_KEY` is set in frontend `.env`
- Open browser console (F12) to see error messages
- Verify API key is valid

### Common Solutions:

1. **Clear browser cache and localStorage:**
   ```javascript
   // In browser console (F12):
   localStorage.clear()
   location.reload()
   ```

2. **Check both servers are running:**
   - Backend: Terminal 1 should show "listening on port 3000"
   - Frontend: Terminal 2 should show "Local: http://localhost:5173"

3. **Verify environment variables:**
   - Backend `.env` in root directory
   - Frontend `.env` in `frontend` directory

---

## Quick Test Checklist

- [ ] Backend server starts without errors
- [ ] Frontend server starts without errors
- [ ] Can access `http://localhost:5173` in browser
- [ ] Can see Login page
- [ ] Can create a new account (Sign Up)
- [ ] Can login with credentials
- [ ] Dashboard loads after login
- [ ] Can view candidates
- [ ] Can vote (if not already voted)
- [ ] Can view vote count
- [ ] Admin can add/edit/delete candidates (if admin)
- [ ] Chatbot opens and responds (if API key is set)

---

## Running in Production

### Build Frontend:

```bash
cd frontend
npm run build
```

This creates a `dist` folder with production-ready files.

### Serve Frontend:

You can serve the `dist` folder using:
- Nginx
- Apache
- Node.js static server
- Any static file hosting service

### Backend Production:

For production, use:
- PM2 for process management
- Environment variables from secure storage
- HTTPS for secure connections
- Proper CORS configuration for your domain

---

## API Endpoints Reference

### Authentication:
- `POST /user/signup` - Register new user
- `POST /user/login` - Login user
- `GET /user/profile` - Get user profile (protected)

### Candidates:
- `GET /candidate` - Get all candidates
- `POST /candidate` - Add candidate (admin only)
- `PUT /candidate/:id` - Update candidate (admin only)
- `DELETE /candidate/:id` - Delete candidate (admin only)

### Voting:
- `GET /candidate/vote/:id` - Vote for candidate (protected)
- `GET /candidate/vote/count` - Get vote counts

---

## Need Help?

1. Check browser console (F12) for errors
2. Check backend terminal for error logs
3. Verify all environment variables are set
4. Ensure MongoDB is running and accessible
5. Check network tab in browser DevTools for API calls

**Happy Voting! 🗳️**

