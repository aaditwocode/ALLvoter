# 🔍 Testing Backend-Frontend Connection

## Quick Connection Test

### 1. Test Backend API Directly

Open your browser or use curl/Postman to test:

**Test Backend Root:**
```
GET http://localhost:3000/
```
Should return: "Welcome to the Voting App API"

**Test Candidates Endpoint:**
```
GET http://localhost:3000/candidate
```
Should return: `[]` (empty array if no candidates) or array of candidates

**Test Vote Count:**
```
GET http://localhost:3000/candidate/vote/count
```
Should return: `[]` (empty array) or vote count data

### 2. Test Frontend-Backend Connection

1. **Start Backend:**
   ```bash
   # In root directory
   npm start
   ```

2. **Start Frontend:**
   ```bash
   # In frontend directory
   npm run dev
   ```

3. **Open Browser:**
   - Go to `http://localhost:5173`
   - Open DevTools (F12)
   - Go to Network tab
   - Try to login or view candidates
   - Check if API calls are successful (status 200)

### 3. Common Issues and Fixes

**Issue: CORS Error**
```
Access to XMLHttpRequest at 'http://localhost:3000/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Fix:** CORS is already configured in `server.js`. Make sure the backend is running.

**Issue: 401 Unauthorized**
```
{ error: 'Token Not Found' }
```

**Fix:** This is normal for protected routes. Make sure you're logged in first.

**Issue: 404 Not Found**
```
Cannot GET /candidate
```

**Fix:** 
- Check backend is running on port 3000
- Verify route is `/candidate` not `/candidates`
- Check backend terminal for errors

**Issue: Connection Refused**
```
ERR_CONNECTION_REFUSED
```

**Fix:**
- Backend server is not running
- Start backend with `npm start` in root directory

### 4. API Endpoint Verification

| Frontend Call | Backend Route | Status |
|--------------|---------------|--------|
| `api.get('/user/profile')` | `GET /user/profile` | ✅ |
| `api.post('/user/login')` | `POST /user/login` | ✅ |
| `api.post('/user/signup')` | `POST /user/signup` | ✅ |
| `api.get('/candidate')` | `GET /candidate` | ✅ |
| `api.post('/candidate')` | `POST /candidate` | ✅ |
| `api.put('/candidate/:id')` | `PUT /candidate/:id` | ✅ |
| `api.delete('/candidate/:id')` | `DELETE /candidate/:id` | ✅ |
| `api.get('/candidate/vote/:id')` | `GET /candidate/vote/:id` | ✅ |
| `api.get('/candidate/vote/count')` | `GET /candidate/vote/count` | ✅ |

### 5. Browser Console Test

Open browser console (F12) and run:

```javascript
// Test API connection
fetch('http://localhost:3000/candidate')
  .then(res => res.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend error:', err))
```

Should return: `✅ Backend connected: []` or array of candidates

### 6. Full Flow Test

1. ✅ Backend running on port 3000
2. ✅ Frontend running on port 5173
3. ✅ Can access frontend in browser
4. ✅ Can see login page
5. ✅ Can sign up new user
6. ✅ Can login
7. ✅ Dashboard loads
8. ✅ Can view candidates
9. ✅ Can vote (if not voted)
10. ✅ Can view vote count
11. ✅ Admin can manage candidates

All steps should work without errors!

