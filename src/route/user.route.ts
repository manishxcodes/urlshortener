import { Router } from 'express';
import { getAuthStatus, signin, signout, signup } from '../controllers/user.controller.js'
import { validate } from '../middleware/validate.middleware.js';
import { signinSchema, signupSchema } from '../schema.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/signin', validate(signinSchema), signin);
router.get('/me', getAuthStatus)
router.post('/signout', authMiddleware, signout);

export default router;