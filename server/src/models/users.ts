import type { User } from '../types/index.js';

let users: User[] = [
  {
    usuario_id: 'u1',
    nome: 'Carlos Admin',
    email: 'admin@projeto.com',
    papel: 'admin',
    bio_perfil: 'Coordenador do laboratório de inovação tecnológica.',
    data_cadastro: '2024-01-10',
  },
];

export function getAll(): User[] {
  return [...users];
}

export function findById(id: string): User | undefined {
  return users.find(u => u.usuario_id === id);
}

export function findByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function insert(data: Omit<User, 'usuario_id' | 'data_cadastro'>): User {
  const user: User = {
    ...data,
    usuario_id: `u${Date.now()}`,
    data_cadastro: new Date().toISOString().split('T')[0],
  };
  users.push(user);
  return user;
}

export function updateById(id: string, data: Partial<User>): User | undefined {
  const idx = users.findIndex(u => u.usuario_id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...data };
  return users[idx];
}

export function deleteById(id: string): boolean {
  const len = users.length;
  users = users.filter(u => u.usuario_id !== id);
  return users.length < len;
}
