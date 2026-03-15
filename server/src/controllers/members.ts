import type { Request, Response } from 'express';
import * as model from '../models/members.js';

function parseId(value: string): number | null {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export const listByProject = async (req: Request, res: Response) => {
  const projectId = parseId(req.params.projectId);
  if (projectId === null) {
    res.status(400).json({ error: 'ID de projeto invalido' });
    return;
  }

  const members = await model.getByProject(projectId);
  res.json(members);
};

export const add = async (req: Request, res: Response) => {
  const projetoId = parseId(String(req.body?.projeto_id ?? ''));
  const usuarioId = parseId(String(req.body?.usuario_id ?? ''));
  if (projetoId === null || usuarioId === null) {
    res.status(400).json({ error: 'projeto_id e usuario_id devem ser inteiros positivos' });
    return;
  }

  const member = await model.insert({ projeto_id: projetoId, usuario_id: usuarioId });
  res.status(201).json(member);
};

export const remove = async (req: Request, res: Response) => {
  const projectId = parseId(req.params.projectId);
  const userId = parseId(req.params.userId);
  if (projectId === null || userId === null) {
    res.status(400).json({ error: 'IDs de membro invalidos' });
    return;
  }

  const deleted = await model.deleteByIds(projectId, userId);
  if (!deleted) {
    res.status(404).json({ error: 'Membro não encontrado' });
    return;
  }
  res.status(204).send();
};
