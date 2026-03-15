import type { Request, Response } from 'express';
import * as model from '../models/users.js';

function parseId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export const list = async (_req: Request, res: Response) => {
  const users = await model.getAll();
  res.json(users);
};

export const getById = async (req: Request, res: Response) => {
  const userId = parseId(req.params.id);
  if (userId === null) {
    res.status(400).json({ error: 'ID de usuario invalido' });
    return;
  }

  const user = await model.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const user = await model.insert(req.body);
  res.status(201).json(user);
};

export const update = async (req: Request, res: Response) => {
  const userId = parseId(req.params.id);
  if (userId === null) {
    res.status(400).json({ error: 'ID de usuario invalido' });
    return;
  }

  const user = await model.updateById(userId, req.body);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json(user);
};

export const remove = async (req: Request, res: Response) => {
  const userId = parseId(req.params.id);
  if (userId === null) {
    res.status(400).json({ error: 'ID de usuario invalido' });
    return;
  }

  const deleted = await model.deleteById(userId);
  if (!deleted) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.status(204).send();
};
