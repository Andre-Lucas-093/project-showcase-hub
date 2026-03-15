import { Project, User, ProjectMember, ProjectDocument, CourseSummary } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  });

  const raw = await response.text();
  const data = raw ? JSON.parse(raw) : undefined;

  if (!response.ok) {
    const message = data?.error || `Erro HTTP ${response.status}`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}

export const api = {
  // Cursos
  async getCourses(): Promise<CourseSummary[]> {
    return request<CourseSummary[]>('/courses');
  },

  // Projetos
  async getProjects(): Promise<Project[]> {
    return request<Project[]>('/projects');
  },

  async getProject(id: string | number): Promise<Project | undefined> {
    try {
      return await request<Project>(`/projects/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return undefined;
      }
      throw error;
    }
  },

  async createProject(data: Omit<Project, 'projeto_id' | 'criado_em' | 'atualizado_em'>): Promise<Project> {
    return request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateProject(id: string | number, data: Partial<Project>): Promise<Project | undefined> {
    try {
      return await request<Project>(`/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return undefined;
      }
      throw error;
    }
  },

  async deleteProject(id: string | number): Promise<boolean> {
    try {
      await request<void>(`/projects/${id}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return false;
      }
      throw error;
    }
  },

  // Usuários
  async getUsers(): Promise<User[]> {
    return request<User[]>('/users');
  },

  async getUser(id: string | number): Promise<User | undefined> {
    try {
      return await request<User>(`/users/${id}`);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return undefined;
      }
      throw error;
    }
  },

  async login(email: string, _password: string): Promise<User | null> {
    try {
      return await request<User>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  async register(data: { nome: string; email: string; papel?: string; bio_perfil?: string }): Promise<User | null> {
    try {
      return await request<User>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        return null;
      }
      throw error;
    }
  },

  // Membros
  async getProjectMembers(projectId: string | number): Promise<(ProjectMember & { user?: User })[]> {
    const members = await request<ProjectMember[]>(`/members/${projectId}`);
    const users = await this.getUsers();

    return members.map(member => ({
      ...member,
      user: users.find(user => user.usuario_id === member.usuario_id),
    }));
  },

  // Documentos
  async getProjectDocuments(projectId: string | number): Promise<ProjectDocument[]> {
    return request<ProjectDocument[]>(`/documents/${projectId}`);
  },
};
