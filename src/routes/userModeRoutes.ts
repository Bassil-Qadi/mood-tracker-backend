import { Router } from 'express';
import { createUserMode, getUserMode } from '../controllers/userModeController';

const router = Router();

router.post('/create', createUserMode);
router.get('/get/:userId', getUserMode);

export default router;