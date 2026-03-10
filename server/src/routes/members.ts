import { Router } from 'express';
import * as controller from '../controllers/members.js';

const membersRouter = Router();

membersRouter.get('/:projectId', controller.listByProject);
membersRouter.post('/', controller.add);
membersRouter.delete('/:projectId/:userId', controller.remove);

export { membersRouter };
