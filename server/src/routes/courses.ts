import { Router } from 'express';
import * as controller from '../controllers/courses.js';

const coursesRouter = Router();

coursesRouter.get('/', controller.list);

export { coursesRouter };