import type { ProjectMember } from '../types/index.js';

let members: ProjectMember[] = [
  { projeto_id: 'p1', usuario_id: 'u1' },
  { projeto_id: 'p2', usuario_id: 'u1' },
];

export function getByProject(projectId: string): ProjectMember[] {
  return members.filter(m => m.projeto_id === projectId);
}

export function insert(data: ProjectMember): ProjectMember {
  members.push(data);
  return data;
}

export function deleteByIds(projectId: string, userId: string): boolean {
  const len = members.length;
  members = members.filter(m => !(m.projeto_id === projectId && m.usuario_id === userId));
  return members.length < len;
}
