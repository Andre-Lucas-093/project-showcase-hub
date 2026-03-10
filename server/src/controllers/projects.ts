import type { Request, Response } from 'express';
import * as model from '../models/projects.js';

export const list = async (_req: Request, res: Response) => {
  const projects = model.getAll();
  res.json(projects);
};

export const getById = async (req: Request, res: Response) => {
  const project = model.findById(req.params.id);
  if (!project) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  res.json(project);
};

export const create = async (req: Request, res: Response) => {
  const project = model.insert(req.body);
  res.status(201).json(project);
};

export const update = async (req: Request, res: Response) => {
  const project = model.updateById(req.params.id, req.body);
  if (!project) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  res.json(project);
};

export const remove = async (req: Request, res: Response) => {
  const deleted = model.deleteById(req.params.id);
  if (!deleted) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  res.status(204).send();
};
