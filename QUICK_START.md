# Backend Quick Start Guide

## Step 1: Install Dependencies
```bash
npm install
```

## Step 2: Create .env File
Create a `.env` file in this directory with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/mode-tracker
JWT_SECRET=dev-secret-key-change-in-production-12345
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-67890
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
FRONTEND_URL=http://localhost:5173
```

## Step 3: Start MongoDB
Make sure MongoDB is running:
```bash
mongod
```

Or use MongoDB Atlas (cloud) - update MONGODB_URI accordingly.

## Step 4: Run the Backend
```bash
npm run dev
```

The server will start on http://localhost:5000

## Test the API
```bash
# Health check
curl http://localhost:5000/health
```

## API Endpoints

- POST `/api/auth/signup` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user (requires auth token)
- PUT `/api/auth/profile` - Update profile (requires auth token)
- POST `/api/auth/refresh` - Refresh token
- POST `/api/auth/logout` - Logout (requires auth token)

See README.md for detailed API documentation.
