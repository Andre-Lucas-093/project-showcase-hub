import type { Request, Response } from 'express';
import * as userModel from '../models/users.js';

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'E-mail é obrigatório' });
    return;
  }

  const user = await userModel.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Usuário não encontrado' });
    return;
  }

  res.json(user);
};

export const register = async (req: Request, res: Response) => {
  const { nome, email, papel, bio_perfil } = req.body;

  if (!nome || !email) {
    res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
    return;
  }

  if (papel === 'admin') {
    res.status(403).json({ error: 'O papel de administrador é exclusivo para professores da instituição. Não é possível se cadastrar como admin.' });
    return;
  }

  const existing = await userModel.findByEmail(email);
  if (existing) {
    res.status(409).json({ error: 'E-mail já cadastrado' });
    return;
  }

  const user = await userModel.insert({
    nome,
    email,
    senha: '',
    papel: papel || 'aluno',
    bio_perfil: bio_perfil || '',
  });

  res.status(201).json(user);
};
