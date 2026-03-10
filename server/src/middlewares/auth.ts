import type { Request, Response, NextFunction } from 'express';

/**
 * Placeholder para middleware de autenticação.
 * Será implementado quando integrarmos JWT ou sessões.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // TODO: implementar verificação de token
  next();
};
