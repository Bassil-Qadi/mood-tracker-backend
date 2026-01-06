import { Router } from 'express';
import { updateProfile } from '../controllers/authController';

const router = Router();

router.post('/update', updateProfile);

export default router;