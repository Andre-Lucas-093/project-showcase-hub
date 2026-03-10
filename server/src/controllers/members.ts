import type { Request, Response } from 'express';
import * as model from '../models/members.js';

export const listByProject = async (req: Request, res: Response) => {
  const members = model.getByProject(req.params.projectId);
  res.json(members);
};

export const add = async (req: Request, res: Response) => {
  const member = model.insert(req.body);
  res.status(201).json(member);
};

export const remove = async (req: Request, res: Response) => {
  const deleted = model.deleteByIds(req.params.projectId, req.params.userId);
  if (!deleted) {
    res.status(404).json({ error: 'Membro não encontrado' });
    return;
  }
  res.status(204).send();
};
