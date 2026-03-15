export type UserRole = 'aluno' | 'mentor' | 'admin';

export type ProjectStatus = 'concluido' | 'andamento' | 'disponivel';

export interface User {
  usuario_id: number;
  nome: string;
  email: string;
  senha: string;
  papel: UserRole;
  bio_perfil: string | null;
  data_cadastro: string | null;
}

export interface Project {
  projeto_id: number;
  logo: string | null;
  titulo: string;
  descricao: string | null;
  status: ProjectStatus;
  curso_id: number | null;
  area?: string | null;
  criado_em: string | null;
  atualizado_em: string | null;
  dono_id: number | null;
  prazo_final: string | null;
}

export interface ProjectMember {
  id: number;
  projeto_id: number | null;
  usuario_id: number | null;
}

export interface ProjectDocument {
  documento_id: number;
  projeto_id: number | null;
  url_arquivo: string;
  enviado_por: number | null;
  data_envio: string | null;
}
