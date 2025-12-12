# 🚀 Quick Start Guide - ALLvoter Full Stack App

## Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Google Gemini API key (for chatbot)

## Backend Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

3. **Start Backend Server:**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   Backend will run on `http://localhost:3000`

## Frontend Setup

1. **Navigate to Frontend Directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_URL=http://localhost:3000
   ```

4. **Start Frontend Development Server:**
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:5173`

## Getting Started

1. **Start Backend:** Open terminal 1, run `npm start` in root directory
2. **Start Frontend:** Open terminal 2, run `npm run dev` in `frontend` directory
3. **Open Browser:** Navigate to `http://localhost:5173`
4. **Sign Up:** Create a new account with your Aadhar Card Number
5. **Login:** Use your credentials to login
6. **Explore:** 
   - View candidates
   - Cast your vote
   - Check vote counts
   - Use the AI chatbot (💬 icon in bottom right)

## Features

### For Voters:
- ✅ Sign up and login
- ✅ View all candidates
- ✅ Vote for a candidate (once)
- ✅ View live vote counts
- ✅ Manage profile and change password
- ✅ AI chatbot assistance

### For Admins:
- ✅ All voter features (except voting)
- ✅ Add new candidates
- ✅ Edit candidate information
- ✅ Delete candidates
- ✅ View all candidate details and vote counts

## Chatbot

The AI chatbot uses Google Gemini API:
- Click the 💬 icon in the bottom right corner
- Ask questions about the voting system
- All API calls are logged to browser console (F12)
- Works on all pages

## Troubleshooting

**Backend not connecting?**
- Check MongoDB connection string
- Verify JWT_SECRET is set
- Check if port 3000 is available

**Frontend not loading?**
- Ensure backend is running
- Check CORS settings
- Verify API URL in `.env`

**Chatbot not working?**
- Verify `VITE_GEMINI_API_KEY` is set
- Check browser console for errors
- Ensure API key is valid

## Project Structure

```
ALLvoter/
├── server.js              # Backend entry point
├── routes/                # API routes
├── models/                # Database models
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── context/      # React context
│   └── package.json
└── package.json
```

## API Endpoints

- `POST /user/signup` - Register new user
- `POST /user/login` - Login user
- `GET /user/profile` - Get user profile (protected)
- `PUT /user/profile/password` - Change password (protected)
- `GET /candidate` - Get all candidates
- `POST /candidate` - Add candidate (admin only)
- `PUT /candidate/:id` - Update candidate (admin only)
- `DELETE /candidate/:id` - Delete candidate (admin only)
- `GET /candidate/vote/:id` - Vote for candidate (protected)
- `GET /candidate/vote/count` - Get vote counts

## Next Steps

1. Create your first admin account (first signup with role='admin')
2. Add candidates through the admin panel
3. Let users vote
4. Monitor vote counts in real-time

Happy Voting! 🗳️

