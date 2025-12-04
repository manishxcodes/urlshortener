import express from 'express';
import { signin, signout, signup } from '../controllers/user.controller.ts'
import { validate } from 'middleware/validate.middleware.ts';
import { signinSchema, signupSchema } from 'schema.ts';
import { authMiddleware } from 'middleware/auth.middleware.ts';

const router = express();

router.post('/signup', validate(signupSchema), signup);
router.post('/signin', validate(signinSchema), signin);
router.post('/signout', authMiddleware, signout);

export default router;