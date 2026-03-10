import { mockUsers } from '@/mocks/users';
import { mockProjects } from '@/mocks/projects';
import { mockMembers } from '@/mocks/members';
import { mockDocuments } from '@/mocks/documents';
import { Project, User, ProjectMember, ProjectDocument } from '@/types';

// Simula delay de rede
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Cópia mutável para operações CRUD
let projects = [...mockProjects];

export const api = {
  // Projetos
  async getProjects(): Promise<Project[]> {
    await delay();
    return [...projects];
  },

  async getProject(id: string): Promise<Project | undefined> {
    await delay();
    return projects.find(p => p.projeto_id === id);
  },

  async createProject(data: Omit<Project, 'projeto_id' | 'criado_em' | 'atualizado_em'>): Promise<Project> {
    await delay();
    const newProject: Project = {
      ...data,
      projeto_id: `p${Date.now()}`,
      criado_em: new Date().toISOString().split('T')[0],
      atualizado_em: new Date().toISOString().split('T')[0],
    };
    projects.push(newProject);
    return newProject;
  },

  async updateProject(id: string, data: Partial<Project>): Promise<Project | undefined> {
    await delay();
    const idx = projects.findIndex(p => p.projeto_id === id);
    if (idx === -1) return undefined;
    projects[idx] = { ...projects[idx], ...data, atualizado_em: new Date().toISOString().split('T')[0] };
    return projects[idx];
  },

  async deleteProject(id: string): Promise<boolean> {
    await delay();
    const len = projects.length;
    projects = projects.filter(p => p.projeto_id !== id);
    return projects.length < len;
  },

  // Usuários
  async getUsers(): Promise<User[]> {
    await delay();
    return [...mockUsers];
  },

  async getUser(id: string): Promise<User | undefined> {
    await delay();
    return mockUsers.find(u => u.usuario_id === id);
  },

  async login(email: string, _password: string): Promise<User | null> {
    await delay(500);
    const user = mockUsers.find(u => u.email === email);
    return user || null;
  },

  async register(data: { nome: string; email: string; papel?: string; bio_perfil?: string }): Promise<User | null> {
    await delay(500);
    const existing = mockUsers.find(u => u.email === data.email);
    if (existing) return null;
    const newUser: User = {
      usuario_id: `u${Date.now()}`,
      nome: data.nome,
      email: data.email,
      papel: (data.papel as User['papel']) || 'aluno',
      bio_perfil: data.bio_perfil || '',
      data_cadastro: new Date().toISOString().split('T')[0],
    };
    mockUsers.push(newUser);
    return newUser;
  },

  // Membros
  async getProjectMembers(projectId: string): Promise<(ProjectMember & { user?: User })[]> {
    await delay();
    const members = mockMembers.filter(m => m.projeto_id === projectId);
    return members.map(m => ({
      ...m,
      user: mockUsers.find(u => u.usuario_id === m.usuario_id),
    }));
  },

  // Documentos
  async getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
    await delay();
    return mockDocuments.filter(d => d.projeto_id === projectId);
  },
};
