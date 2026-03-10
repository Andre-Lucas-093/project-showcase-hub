import { Router } from 'express';
import * as controller from '../controllers/users.js';

const usersRouter = Router();

usersRouter.get('/', controller.list);
usersRouter.get('/:id', controller.getById);
usersRouter.post('/', controller.create);
usersRouter.put('/:id', controller.update);
usersRouter.delete('/:id', controller.remove);

export { usersRouter };
