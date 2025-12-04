import { createUrl, deleteUrl, getAllUrl, redirect } from 'controllers/url.controller';
import express from 'express';
import { authMiddleware } from 'middleware/auth.middleware.ts';
import { validate } from 'middleware/validate.middleware';
import { createUrlRequestSchema } from '../schema.ts';

const router = express();

router.post('/shorten', validate(createUrlRequestSchema), authMiddleware,  createUrl);
router.get('/', authMiddleware, getAllUrl);
router.get('/:shortCode', redirect);
router.delete('/', authMiddleware, deleteUrl);

export default router;