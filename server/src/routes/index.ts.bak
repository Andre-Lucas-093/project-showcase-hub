import { Router } from 'express';
import { authRouter } from './auth.js';
import { projectsRouter } from './projects.js';
import { usersRouter } from './users.js';
import { membersRouter } from './members.js';
import { documentsRouter } from './documents.js';
import { coursesRouter } from './courses.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/projects', projectsRouter);
router.use('/users', usersRouter);
router.use('/members', membersRouter);
router.use('/documents', documentsRouter);
router.use('/courses', coursesRouter);

export { router };
