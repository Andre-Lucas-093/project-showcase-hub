import type { Request, Response } from 'express';
import * as model from '../models/users.js';

export const list = async (_req: Request, res: Response) => {
  const users = model.getAll();
  res.json(users);
};

export const getById = async (req: Request, res: Response) => {
  const user = model.findById(req.params.id);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json(user);
};

export const create = async (req: Request, res: Response) => {
  const user = model.insert(req.body);
  res.status(201).json(user);
};

export const update = async (req: Request, res: Response) => {
  const user = model.updateById(req.params.id, req.body);
  if (!user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.json(user);
};

export const remove = async (req: Request, res: Response) => {
  const deleted = model.deleteById(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return;
  }
  res.status(204).send();
};
