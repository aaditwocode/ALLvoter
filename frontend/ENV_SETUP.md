# Environment Setup Guide

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# Google Gemini API Key
# Get your API key from: https://makersuite.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Gemini model (optional).
# Recommended text models:
# - gemini-1.5-flash-latest (fast, default)
# - gemini-1.5-pro-latest   (better quality)
# - gemini-pro              (compatibility)
VITE_GEMINI_MODEL=gemini-1.5-flash-latest

# Backend API URL (optional, defaults to http://localhost:3000)
VITE_API_URL=http://localhost:3000
```
