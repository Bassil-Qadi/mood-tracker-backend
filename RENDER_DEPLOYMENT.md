# Render Deployment Guide

This guide provides step-by-step instructions for deploying the Mood Tracker Backend to Render.

## Prerequisites

1. A GitHub account with your code pushed to a repository
2. A Render account (sign up at https://render.com)
3. A MongoDB Atlas account (or use Render's MongoDB service)

---

## Step 1: Prepare Your Code

### ✅ Security Fix Applied
- Removed hardcoded MongoDB credentials from `database.ts`
- The app now requires `MONGODB_URI` environment variable

### ✅ Build Configuration
Your `package.json` already has the correct scripts:
- `build`: Compiles TypeScript to JavaScript
- `start`: Runs the compiled server from `dist/server.js`

---

## Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string (it looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`)
7. Replace `<password>` with your database user password
8. **Save this connection string** - you'll need it in Step 4

### Option B: Render MongoDB (Alternative)

1. In Render dashboard, click "New +"
2. Select "MongoDB"
3. Choose a name and region
4. Click "Create Database"
5. Once created, copy the "Internal Database URL" or "External Database URL"

---

## Step 3: Push Code to GitHub

Make sure your code is pushed to GitHub:

```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

**Important**: Make sure `.env` is in `.gitignore` (it already is ✅)

---

## Step 4: Deploy on Render

### 4.1 Create a New Web Service

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" button
3. Select "Web Service"
4. Connect your GitHub account if not already connected
5. Select your repository: `mood-tracker-backend` (or your repo name)
6. Click "Connect"

### 4.2 Configure Build Settings

Fill in the following settings:

**Name**: `mood-tracker-backend` (or any name you prefer)

**Region**: Choose the closest region to your users

**Branch**: `main` (or `master` if that's your default branch)

**Root Directory**: Leave empty (or set to `.` if your code is in a subdirectory)

**Runtime**: `Node`

**Build Command**: 
```
npm install --include=dev && npm run build
```

**⚠️ CRITICAL**: You MUST use `--include=dev` because TypeScript is in devDependencies and is required for the build. Without it, you'll get the error: "Cannot find module '/opt/render/project/src/dist/server.js'"

**Start Command**: 
```
npm start
```

**Alternative**: You can use the `render.yaml` file (already created in your repo) which will auto-configure these settings.

### 4.3 Set Environment Variables

Click "Advanced" and add the following environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `10000` | Render automatically sets PORT, but you can set it explicitly |
| `MONGODB_URI` | `your-mongodb-connection-string` | Your MongoDB Atlas connection string from Step 2 |
| `JWT_SECRET` | `your-super-secret-jwt-key-min-32-chars` | **Generate a strong random string (minimum 32 characters)** |
| `JWT_REFRESH_SECRET` | `your-super-secret-refresh-key-min-32-chars` | **Generate a different strong random string (minimum 32 characters)** |
| `JWT_ACCESS_EXPIRY` | `15m` | Access token expiry time |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token expiry time |
| `FRONTEND_URL` | `https://your-frontend-url.com` | Your frontend URL for CORS (update this with your actual frontend URL) |

**⚠️ Important Notes:**
- Generate strong JWT secrets using: `openssl rand -base64 32` (run in terminal) or use an online generator
- For `FRONTEND_URL`, use your actual frontend deployment URL (e.g., `https://your-app.onrender.com` or your custom domain)
- If you don't have a frontend yet, you can set it to `*` temporarily (not recommended for production) or leave it and update later

### 4.4 Create the Service

1. Scroll down and click "Create Web Service"
2. Render will start building and deploying your application
3. This process takes 2-5 minutes

---

## Step 5: Monitor Deployment

1. Watch the build logs in the Render dashboard
2. Common issues to watch for:
   - **Build errors**: Check if TypeScript compilation succeeds
   - **Missing dependencies**: Ensure all dependencies are in `package.json`
   - **Environment variables**: Verify all required variables are set

---

## Step 6: Verify Deployment

Once deployment is complete:

1. **Check Health Endpoint**: 
   - Visit: `https://your-service-name.onrender.com/health`
   - Should return: `{"success":true,"message":"Server is running",...}`

2. **Test API Endpoint**:
   - Try: `https://your-service-name.onrender.com/api/auth/signup` (POST request)
   - Or use Postman/curl to test

3. **Check Logs**:
   - In Render dashboard, go to "Logs" tab
   - Look for: `✅ MongoDB connected successfully`
   - Look for: `🚀 Server running on port 10000` (or your PORT)

---

## Common Issues and Solutions

### ⚠️ CRITICAL FIX: "Cannot find module '/opt/render/project/src/dist/server.js'"

**This is the error you're experiencing!** Here's how to fix it:

**Root Cause**: Render doesn't install `devDependencies` by default, so TypeScript isn't available during the build step, causing the build to fail silently.

**Solution - Update Build Command in Render Dashboard:**

1. Go to your Render service dashboard
2. Click on "Settings" tab
3. Scroll to "Build Command"
4. **Replace** the build command with one of these:

   **Option A (Recommended):**
   ```
   npm install --include=dev && npm run build
   ```

   **Option B:**
   ```
   npm ci --include=dev && npm run build
   ```

   **Option C:**
   ```
   NODE_ENV=production npm install && npm run build
   ```
   (Note: This installs all dependencies including dev)

5. Click "Save Changes"
6. Go to "Manual Deploy" → "Deploy latest commit"

**Why this works**: The `--include=dev` flag ensures TypeScript and other devDependencies are installed, allowing the build to complete successfully.

**Verify the fix**: After redeploying, check the build logs. You should see:
- `> tsc` (TypeScript compilation)
- Files being created in `dist/` folder
- Build completing successfully
- Server starting with `npm start`

---

### Issue 1: "Cannot find module '/opt/render/project/src/dist/server.js'"

**Solution**: 
- This error means the build didn't complete successfully or TypeScript wasn't installed
- **Fix 1**: Update your Build Command in Render to: `npm install --include=dev && npm run build`
- **Fix 2**: Or use: `npm ci && npm run build` 
- **Fix 3**: Make sure TypeScript is being installed (it's in devDependencies, so use `--include=dev`)
- **Fix 4**: Check the build logs in Render - look for TypeScript compilation errors
- **Fix 5**: Verify that `dist/server.js` exists after build (check logs)

### Issue 1b: Build Fails - "Cannot find module" (other modules)

**Solution**: Make sure `package.json` includes all dependencies. Run `npm install` locally to verify.

### Issue 2: Application Crashes - "MONGODB_URI is not defined"

**Solution**: 
- Go to Environment tab in Render
- Verify `MONGODB_URI` is set correctly
- Make sure there are no extra spaces or quotes
- Re-deploy after fixing

### Issue 3: CORS Errors

**Solution**: 
- Update `FRONTEND_URL` environment variable with your actual frontend URL
- Make sure it matches exactly (including `https://` and no trailing slash)
- Re-deploy after updating

### Issue 4: Port Binding Error

**Solution**: 
- Render automatically sets `PORT` environment variable
- Your code already uses `process.env.PORT || 5000` ✅
- If issues persist, explicitly set `PORT=10000` in environment variables

### Issue 5: MongoDB Connection Timeout

**Solution**:
- If using MongoDB Atlas, make sure your IP is whitelisted (or use `0.0.0.0/0` for all IPs)
- Check that your MongoDB connection string is correct
- Verify database user has proper permissions

### Issue 6: Application Goes to Sleep (Free Tier)

**Solution**:
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep takes ~30 seconds to wake up
- Consider upgrading to paid plan for always-on service

---

## Step 7: Update Frontend (If Applicable)

Once your backend is deployed, update your frontend to use the new API URL:

```javascript
// Example: Update your frontend API base URL
const API_BASE_URL = 'https://your-service-name.onrender.com/api';
```

---

## Step 8: Set Up Custom Domain (Optional)

1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Follow Render's DNS configuration instructions

---

## Environment Variables Summary

Here's a checklist of all required environment variables:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000` (or leave Render's default)
- [ ] `MONGODB_URI` = Your MongoDB connection string
- [ ] `JWT_SECRET` = Strong random string (32+ chars)
- [ ] `JWT_REFRESH_SECRET` = Different strong random string (32+ chars)
- [ ] `JWT_ACCESS_EXPIRY` = `15m`
- [ ] `JWT_REFRESH_EXPIRY` = `7d`
- [ ] `FRONTEND_URL` = Your frontend URL

---

## Quick Reference Commands

**Generate JWT Secret (run in terminal):**
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Linux/Mac
openssl rand -base64 32
```

**Test API locally before deploying:**
```bash
npm run build
npm start
```

**Check if build works:**
```bash
npm install
npm run build
# Check if dist/ folder is created with .js files
```

---

## Support

If you encounter issues:
1. Check Render logs in the dashboard
2. Verify all environment variables are set
3. Test the build locally: `npm run build && npm start`
4. Check MongoDB connection from your local machine
5. Review Render documentation: https://render.com/docs

---

## Security Checklist

Before going to production:

- [x] Removed hardcoded credentials from code
- [ ] Use strong JWT secrets (32+ characters, random)
- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS with actual frontend URL
- [ ] Use MongoDB Atlas with proper authentication
- [ ] Enable MongoDB IP whitelisting
- [ ] Review and test all API endpoints
- [ ] Set up monitoring/logging (optional but recommended)

---

**Your backend should now be live on Render! 🚀**

