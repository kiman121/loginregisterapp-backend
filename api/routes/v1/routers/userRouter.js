import { Router } from 'express';

import * as userController from '../../../controllers/userController.js';
import protect from '../../../middleware/authMiddleware.js';
const router = Router();

router.route('/').post(userController.registerUser);
router.post('/login', userController.loginUser);
router.post('/forgot-password', userController.forgotPassword);
router.patch('/reset-password/:token', userController.resetPassword);

export default router;
