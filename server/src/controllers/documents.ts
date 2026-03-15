import type { Request, Response } from 'express';
import * as model from '../models/documents.js';

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

  const docs = await model.getByProject(projectId);
  res.json(docs);
};

export const upload = async (req: Request, res: Response) => {
  const projetoIdRaw = req.body?.projeto_id;
  const enviadoPorRaw = req.body?.enviado_por;
  const projetoId = projetoIdRaw == null ? null : parseId(String(projetoIdRaw));
  const enviadoPor = enviadoPorRaw == null ? null : parseId(String(enviadoPorRaw));
  const urlArquivo = req.body?.url_arquivo;

  if (projetoIdRaw != null && projetoId === null) {
    res.status(400).json({ error: 'projeto_id invalido' });
    return;
  }
  if (enviadoPorRaw != null && enviadoPor === null) {
    res.status(400).json({ error: 'enviado_por invalido' });
    return;
  }
  if (!urlArquivo || typeof urlArquivo !== 'string') {
    res.status(400).json({ error: 'url_arquivo e obrigatorio' });
    return;
  }

  const doc = await model.insert({
    projeto_id: projetoId,
    url_arquivo: urlArquivo,
    enviado_por: enviadoPor,
  });
  res.status(201).json(doc);
};

export const remove = async (req: Request, res: Response) => {
  const documentId = parseId(req.params.id);
  if (documentId === null) {
    res.status(400).json({ error: 'ID de documento invalido' });
    return;
  }

  const deleted = await model.deleteById(documentId);
  if (!deleted) {
    res.status(404).json({ error: 'Documento não encontrado' });
    return;
  }
  res.status(204).send();
};
