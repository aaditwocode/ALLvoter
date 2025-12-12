# ALLvoter Frontend - Indian Voting System

A beautiful, Indian-themed frontend for the ALLvoter voting application with integrated Google Gemini AI chatbot.

## 🎨 Features

- **Indian Theme Design**: Beautiful UI with saffron, white, and green color scheme (Indian flag colors)
- **Authentication**: Login and Signup pages with JWT token management
- **User Dashboard**: Personalized dashboard with quick actions
- **Candidate Management**: View and vote for candidates
- **Admin Panel**: Full CRUD operations for managing candidates
- **Live Vote Count**: Real-time vote counting with visual progress bars
- **Profile Management**: View and update user profile, change password
- **AI Chatbot**: Google Gemini-powered chatbot with console logging enabled

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. **Install Dependencies:**

   ```bash
   cd frontend
   npm install
   ```

2. **Set Up Environment Variables:**

   Create a `.env` file in the `frontend` directory:

   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_URL=http://localhost:3000
   ```

3. **Start Development Server:**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for Production:**

   ```bash
   npm run build
   ```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Chatbot.jsx          # Gemini AI chatbot component
│   │   └── Chatbot.css
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication context
│   ├── pages/
│   │   ├── Login.jsx           # Login page
│   │   ├── Signup.jsx          # Signup page
│   │   ├── Dashboard.jsx       # Main dashboard
│   │   ├── Candidates.jsx      # Candidate listing
│   │   ├── VoteCount.jsx       # Vote count display
│   │   ├── Profile.jsx         # User profile
│   │   └── AdminPanel.jsx      # Admin CRUD operations
│   ├── services/
│   │   ├── api.js              # Axios API client
│   │   └── gemini.js           # Gemini API service
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## 🤖 Chatbot Features

The integrated Google Gemini chatbot:
- **Console Logging**: All API calls and responses are logged to the browser console
- **Context Awareness**: Maintains conversation history for better responses
- **Error Handling**: Graceful error handling with user-friendly messages
- **Indian Context**: Pre-configured to help with voting system queries

### Console Logging

The chatbot logs the following to the browser console:
- 📤 Outgoing messages to Gemini API
- ✅ Successful responses
- ❌ Errors and API failures
- 📊 API usage metadata

Open browser DevTools (F12) to see the logs.

## 🎨 Design Theme

The frontend uses an Indian-inspired design:
- **Saffron** (#FF9933): Primary accent color
- **White** (#FFFFFF): Clean backgrounds
- **Green** (#138808): Success states and accents
- **Navy Blue** (#000080): Text and headers

## 📡 API Integration

The frontend connects to the backend API at `http://localhost:3000` by default. Make sure:
1. Backend server is running
2. CORS is enabled on the backend
3. API endpoints match the backend routes

## 🔐 Authentication Flow

1. User signs up or logs in
2. JWT token is stored in localStorage
3. Token is automatically included in API requests
4. Protected routes redirect to login if not authenticated

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Notes

- The chatbot requires a valid Google Gemini API key
- All API calls include authentication tokens automatically
- The app is fully responsive and works on mobile devices
- Console logging is enabled by default for debugging

## 🐛 Troubleshooting

**Chatbot not working?**
- Check if `VITE_GEMINI_API_KEY` is set in `.env`
- Verify the API key is valid
- Check browser console for error messages

**API calls failing?**
- Ensure backend server is running
- Check CORS configuration on backend
- Verify API URL in `.env` file

## 📄 License

ISC

