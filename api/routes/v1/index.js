import { Router } from 'express';

// Routes
import userRouter from './routers/userRouter.js';

const router = Router();

router.use('/users', userRouter);

export default router;
