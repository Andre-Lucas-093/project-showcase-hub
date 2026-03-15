import type { Request, Response } from 'express';
import * as model from '../models/projects.js';

function parseId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export const list = async (_req: Request, res: Response) => {
  const projects = await model.getAll();
  res.json(projects);
};

export const getById = async (req: Request, res: Response) => {
  const projectId = parseId(req.params.id);
  if (projectId === null) {
    res.status(400).json({ error: 'ID de projeto invalido' });
    return;
  }

  const project = await model.findById(projectId);
  if (!project) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  res.json(project);
};

export const create = async (req: Request, res: Response) => {
  const project = await model.insert(req.body);
  res.status(201).json(project);
};

export const update = async (req: Request, res: Response) => {
  const projectId = parseId(req.params.id);
  if (projectId === null) {
    res.status(400).json({ error: 'ID de projeto invalido' });
    return;
  }

  const project = await model.updateById(projectId, req.body);
  if (!project) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  res.json(project);
};

export const remove = async (req: Request, res: Response) => {
  const projectId = parseId(req.params.id);
  if (projectId === null) {
    res.status(400).json({ error: 'ID de projeto invalido' });
    return;
  }

  const deleted = await model.deleteById(projectId);
  if (!deleted) {
    res.status(404).json({ error: 'Projeto não encontrado' });
    return;
  }
  res.status(204).send();
};
