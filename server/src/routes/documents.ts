import { Router } from 'express';
import * as controller from '../controllers/documents.js';

const documentsRouter = Router();

documentsRouter.get('/:projectId', controller.listByProject);
documentsRouter.post('/', controller.upload);
documentsRouter.delete('/:id', controller.remove);

export { documentsRouter };
