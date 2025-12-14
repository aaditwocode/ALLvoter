# 🔧 MongoDB Atlas Setup Guide

This guide will help you configure MongoDB Atlas connection for your ALLvoter application.

---

## ✅ Step 1: Get Your MongoDB Atlas Connection String

1. **Log in to MongoDB Atlas**: https://cloud.mongodb.com/

2. **Navigate to your cluster** (or create a new one if you haven't)

3. **Click "Connect"** button on your cluster

4. **Choose "Connect your application"**

5. **Copy the connection string** - it should look like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **IMPORTANT**: Replace `<username>` and `<password>` with your actual database user credentials

7. **Add your database name** at the end, before the `?`:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/allvoter?retryWrites=true&w=majority
   ```
   (Replace `allvoter` with your preferred database name)

---

## ✅ Step 2: Configure Network Access (IP Whitelist)

**This is crucial for connection to work!**

1. In MongoDB Atlas, go to **Network Access** (left sidebar)

2. Click **"Add IP Address"**

3. You have two options:
   
   **Option A - For Development (Less Secure):**
   - Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` to whitelist
   - ⚠️ Only use this for testing/development

   **Option B - For Production (More Secure):**
   - Click **"Add Current IP Address"** (adds your current IP)
   - Or manually enter your IP address
   - Recommended for production

4. Click **"Confirm"**

---

## ✅ Step 3: Create Database User

1. In MongoDB Atlas, go to **Database Access** (left sidebar)

2. Click **"Add New Database User"**

3. Choose authentication method: **Password**

4. Set username and password (remember these - you'll need them in connection string)

5. Set user privileges: **"Read and write to any database"** (or more restrictive as needed)

6. Click **"Add User"**

---

## ✅ Step 4: Update Your .env File

Open your `.env` file in the root directory and update/add:

```env
# MongoDB Atlas Connection
MONGODB_URL=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/allvoter?retryWrites=true&w=majority

# Other required variables
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=3000

# Optional: Gemini API
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important Notes:**
- Replace `yourusername` with your database username
- Replace `yourpassword` with your database password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
- Replace `allvoter` with your database name (optional, can be anything)
- If your password contains special characters like `@`, `#`, `:`, etc., you MUST URL-encode them:
  - `@` becomes `%40`
  - `#` becomes `%23`
  - `:` becomes `%3A`
  - `%` becomes `%25`
  - `/` becomes `%2F`

**Password Encoding Example:**
If your password is `P@ssw0rd#123`, the connection string becomes:
```
mongodb+srv://username:P%40ssw0rd%23123@cluster0.xxxxx.mongodb.net/allvoter
```

---

## ✅ Step 5: Test the Connection

Run the test script:

```bash
node test-mongodb-connection.js
```

You should see:
```
✅ SUCCESS! Connected to MongoDB successfully!
```

If you see errors, check the troubleshooting section below.

---

## ✅ Step 6: Start Your Server

Once the connection test passes:

```bash
npm start
```

You should see:
```
✅ Connected to MongoDB successfully!
📊 Database: allvoter
🌐 Host: cluster0.xxxxx.mongodb.net
✅ Server listening on port 3000
```

---

## 🔍 Troubleshooting Common Issues

### ❌ Error: "authentication failed"

**Causes:**
- Wrong username or password
- Special characters in password not URL-encoded
- User doesn't exist in Database Access

**Solution:**
1. Double-check username and password
2. URL-encode special characters in password
3. Verify user exists in Atlas Database Access section

---

### ❌ Error: "timeout" or "ETIMEDOUT"

**Causes:**
- IP address not whitelisted
- Cluster is still being created
- Internet connectivity issues

**Solution:**
1. Go to Network Access in Atlas
2. Add your IP address (or use 0.0.0.0/0 for testing)
3. Wait a few minutes if cluster was just created
4. Check your internet connection

---

### ❌ Error: "ENOTFOUND" or "getaddrinfo"

**Causes:**
- Incorrect connection string format
- Wrong cluster hostname

**Solution:**
1. Copy the connection string directly from Atlas "Connect" button
2. Make sure it starts with `mongodb+srv://`
3. Verify the cluster hostname is correct

---

### ❌ Error: "MONGODB_URL not found"

**Causes:**
- .env file doesn't exist
- Variable name is wrong
- .env file is in wrong location

**Solution:**
1. Make sure .env file is in root directory (same level as server.js)
2. Variable name should be exactly: `MONGODB_URL` (or `MONGODB_URI`)
3. No spaces around the `=` sign
4. No quotes around the connection string value

---

## 📋 Quick Checklist

Before testing, make sure:

- [ ] Cluster is created and running in MongoDB Atlas
- [ ] Database user is created (Database Access)
- [ ] IP address is whitelisted (Network Access)
- [ ] Connection string copied from Atlas "Connect" button
- [ ] Username and password replaced in connection string
- [ ] Special characters in password are URL-encoded
- [ ] Database name added to connection string
- [ ] MONGODB_URL added to .env file
- [ ] .env file is in root directory
- [ ] No extra quotes or spaces in .env file

---

## 🔒 Security Best Practices

1. **Never commit .env file** - It's already in .gitignore
2. **Use environment-specific IP whitelisting** in production
3. **Create separate database users** for different environments
4. **Use strong passwords** for database users
5. **Rotate passwords** regularly in production

---

## 💡 Connection String Format Reference

**Basic Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database?options
```

**Example:**
```
mongodb+srv://admin:P%40ssw0rd@cluster0.abc123.mongodb.net/allvoter?retryWrites=true&w=majority
```

**Breakdown:**
- `mongodb+srv://` - Protocol (SRV connection for Atlas)
- `admin` - Username
- `P%40ssw0rd` - Password (URL-encoded)
- `cluster0.abc123.mongodb.net` - Cluster hostname
- `allvoter` - Database name
- `?retryWrites=true&w=majority` - Connection options

---

**Need more help?** Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/

