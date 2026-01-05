# Mode Tracker Backend API

Backend API for the Mode Tracker application built with Express, TypeScript, and MongoDB.

## Features

- ✅ User authentication with JWT tokens
- ✅ Secure password hashing with bcrypt
- ✅ MongoDB database with Mongoose ODM
- ✅ TypeScript for type safety
- ✅ Input validation with express-validator
- ✅ Centralized error handling
- ✅ CORS configured for frontend
- ✅ Access and refresh token implementation

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Setup

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mode-tracker

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

**Important:** Change the JWT secrets to secure random strings in production!

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
# It should already be running
```

Alternatively, use MongoDB Atlas (cloud):
1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in `.env` file

### 4. Run the Server

Development mode (with hot reload):
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

All authentication routes are prefixed with `/api/auth`

#### POST /api/auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profileImage": "https://example.com/image.jpg" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "..."
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### POST /api/auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "..."
    },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

#### GET /api/auth/me
Get current user information (Protected route).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "..."
    }
  }
}
```

#### PUT /api/auth/profile
Update user profile (Protected route).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "Jane Doe", // optional
  "email": "jane@example.com", // optional
  "profileImage": "https://example.com/new-image.jpg" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "profileImage": "..."
    }
  }
}
```

#### POST /api/auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "..."
  }
}
```

#### POST /api/auth/logout
Logout user (Protected route).

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

### Health Check

#### GET /health
Check if the server is running.

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts         # MongoDB connection
│   ├── controllers/
│   │   └── authController.ts   # Authentication logic
│   ├── middleware/
│   │   ├── auth.ts             # JWT verification
│   │   ├── errorHandler.ts     # Error handling
│   │   └── validate.ts         # Input validation
│   ├── models/
│   │   └── User.ts             # User schema
│   ├── routes/
│   │   └── authRoutes.ts       # Auth endpoints
│   ├── types/
│   │   └── express.d.ts        # TypeScript definitions
│   ├── utils/
│   │   └── jwt.ts              # JWT utilities
│   └── server.ts               # App entry point
├── dist/                        # Compiled JavaScript (generated)
├── .env                         # Environment variables (create this)
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Technologies Used

- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **express-validator** - Input validation
- **CORS** - Cross-origin resource sharing

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT access tokens (15 minutes expiry)
- JWT refresh tokens (7 days expiry)
- Input validation and sanitization
- CORS configuration
- Error handling without sensitive data exposure
- Passwords excluded from JSON responses

## Development

Lint code:
```bash
npm run lint
```

Build TypeScript:
```bash
npm run build
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment mode | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/mode-tracker |
| JWT_SECRET | Secret for access tokens | - |
| JWT_REFRESH_SECRET | Secret for refresh tokens | - |
| JWT_ACCESS_EXPIRY | Access token expiry | 15m |
| JWT_REFRESH_EXPIRY | Refresh token expiry | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |

## Next Steps

1. Create a `.env` file with your configuration
2. Install dependencies: `npm install`
3. Start MongoDB
4. Run the development server: `npm run dev`
5. Test endpoints using Postman or your frontend application

## License

ISC


