import type { Project } from '../types/index.js';

let projects: Project[] = [
  {
    projeto_id: 'p1',
    logo: '',
    titulo: 'SmartCampus IoT',
    descricao: 'Sistema de monitoramento inteligente do campus universitário utilizando sensores IoT.',
    status: 'andamento',
    area: 'Internet das Coisas',
    criado_em: '2024-06-01',
    atualizado_em: '2025-01-15',
    dono_id: 'u1',
    prazo_final: '2025-07-30',
  },
  {
    projeto_id: 'p2',
    logo: '',
    titulo: 'MedIA - Diagnóstico Assistido',
    descricao: 'Aplicação de redes neurais convolucionais para auxílio no diagnóstico de imagens médicas.',
    status: 'concluido',
    area: 'Inteligência Artificial',
    criado_em: '2024-02-10',
    atualizado_em: '2024-12-20',
    dono_id: 'u1',
    prazo_final: '2024-12-15',
  },
];

export function getAll(): Project[] {
  return [...projects];
}

export function findById(id: string): Project | undefined {
  return projects.find(p => p.projeto_id === id);
}

export function insert(data: Omit<Project, 'projeto_id' | 'criado_em' | 'atualizado_em'>): Project {
  const now = new Date().toISOString().split('T')[0];
  const project: Project = {
    ...data,
    projeto_id: `p${Date.now()}`,
    criado_em: now,
    atualizado_em: now,
  };
  projects.push(project);
  return project;
}

export function updateById(id: string, data: Partial<Project>): Project | undefined {
  const idx = projects.findIndex(p => p.projeto_id === id);
  if (idx === -1) return undefined;
  projects[idx] = { ...projects[idx], ...data, atualizado_em: new Date().toISOString().split('T')[0] };
  return projects[idx];
}

export function deleteById(id: string): boolean {
  const len = projects.length;
  projects = projects.filter(p => p.projeto_id !== id);
  return projects.length < len;
}
