import express from 'express';
import { signup } from '../controllers/user.controller.ts'
import { validate } from 'middleware/validate.middleware.ts';
import { signupSchema } from 'schema.ts';

const router = express();

router.post('/signup', validate(signupSchema), signup)