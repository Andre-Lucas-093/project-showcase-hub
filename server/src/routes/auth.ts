import { Router } from 'express';
import * as controller from '../controllers/auth.js';

const authRouter = Router();

authRouter.post('/login', controller.login);
authRouter.post('/register', controller.register);

export { authRouter };
