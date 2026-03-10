import type { Request, Response } from 'express';
import * as model from '../models/documents.js';

export const listByProject = async (req: Request, res: Response) => {
  const docs = model.getByProject(req.params.projectId);
  res.json(docs);
};

export const upload = async (req: Request, res: Response) => {
  const doc = model.insert(req.body);
  res.status(201).json(doc);
};

export const remove = async (req: Request, res: Response) => {
  const deleted = model.deleteById(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Documento não encontrado' });
    return;
  }
  res.status(204).send();
};
