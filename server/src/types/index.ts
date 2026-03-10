export type UserRole = 'aluno' | 'mentor' | 'admin';

export type ProjectStatus = 'concluido' | 'andamento' | 'disponivel';

export interface User {
  usuario_id: string;
  nome: string;
  email: string;
  papel: UserRole;
  bio_perfil: string;
  data_cadastro: string;
}

export interface Project {
  projeto_id: string;
  logo: string;
  titulo: string;
  descricao: string;
  status: ProjectStatus;
  area: string;
  criado_em: string;
  atualizado_em: string;
  dono_id: string;
  prazo_final: string;
}

export interface ProjectMember {
  projeto_id: string;
  usuario_id: string;
}

export interface ProjectDocument {
  documento_id: string;
  projeto_id: string;
  url_arquivo: string;
  nome_arquivo: string;
  enviado_por: string;
  data_envio: string;
}
