import { createUrl, deleteUrl, getAllUrl, redirect } from 'controllers/url.controller.js';
import { authMiddleware } from 'middleware/auth.middleware.js';
import { validate } from 'middleware/validate.middleware.js';
import { createUrlRequestSchema } from '../schema.js';
import { Router } from 'express';

const router = Router();

router.post('/shorten', validate(createUrlRequestSchema), authMiddleware,  createUrl);
router.get('/', authMiddleware, getAllUrl);
router.get('/:shortCode', redirect);
router.delete('/', authMiddleware, deleteUrl);

export default router;