import { Router } from 'express';
import * as controller from '../controllers/projects.js';

const projectsRouter = Router();

projectsRouter.get('/', controller.list);
projectsRouter.get('/:id', controller.getById);
projectsRouter.post('/', controller.create);
projectsRouter.put('/:id', controller.update);
projectsRouter.delete('/:id', controller.remove);

export { projectsRouter };
