import { Router } from 'express';
import {
  signup,
  login,
  getCurrentUser,
  updateProfile,
  refreshToken,
  logout
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  signupValidation,
  loginValidation,
  updateProfileValidation
} from '../middleware/validate';

const router = Router();

// Public routes
router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/refresh', refreshToken);

// Protected routes (require authentication)
router.get('/me', authenticate, getCurrentUser);
router.put('/profile', authenticate, updateProfileValidation, updateProfile);
router.post('/logout', authenticate, logout);

export default router;


