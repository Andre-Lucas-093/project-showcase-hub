-- Schema: project_case
-- Criação do banco e tabelas

CREATE DATABASE IF NOT EXISTS project_case
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE project_case;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  usuario_id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(150) NOT NULL,
  email VARCHAR(200) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL DEFAULT '',
  papel ENUM('aluno', 'mentor', 'admin') NOT NULL DEFAULT 'aluno',
  genero CHAR(1) DEFAULT NULL COMMENT 'M = Masculino, F = Feminino',
  matricula VARCHAR(50) DEFAULT NULL,
  bio_perfil TEXT DEFAULT NULL,
  data_cadastro DATE NOT NULL DEFAULT (CURRENT_DATE)
);

-- Tabela de Projetos
CREATE TABLE IF NOT EXISTS projetos (
  projeto_id VARCHAR(50) PRIMARY KEY,
  logo VARCHAR(500) DEFAULT '',
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NOT NULL,
  status ENUM('concluido', 'andamento', 'disponivel') NOT NULL DEFAULT 'disponivel',
  area VARCHAR(100) NOT NULL,
  criado_em DATE NOT NULL DEFAULT (CURRENT_DATE),
  atualizado_em DATE NOT NULL DEFAULT (CURRENT_DATE),
  dono_id VARCHAR(50) NOT NULL,
  prazo_final DATE NOT NULL,
  FOREIGN KEY (dono_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);

-- Tabela de Membros do Projeto
CREATE TABLE IF NOT EXISTS projeto_membros (
  projeto_id VARCHAR(50) NOT NULL,
  usuario_id VARCHAR(50) NOT NULL,
  PRIMARY KEY (projeto_id, usuario_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(projeto_id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);

-- Tabela de Documentos do Projeto
CREATE TABLE IF NOT EXISTS projeto_documentos (
  documento_id VARCHAR(50) PRIMARY KEY,
  projeto_id VARCHAR(50) NOT NULL,
  url_arquivo VARCHAR(500) NOT NULL,
  nome_arquivo VARCHAR(300) NOT NULL,
  enviado_por VARCHAR(50) NOT NULL,
  data_envio DATE NOT NULL DEFAULT (CURRENT_DATE),
  FOREIGN KEY (projeto_id) REFERENCES projetos(projeto_id) ON DELETE CASCADE,
  FOREIGN KEY (enviado_por) REFERENCES usuarios(usuario_id) ON DELETE CASCADE
);

-- Dados iniciais (seed)

INSERT IGNORE INTO usuarios (usuario_id, nome, email, senha, papel, matricula, bio_perfil, data_cadastro)
VALUES
  ('u1', 'Carlos Admin', 'admin@projeto.com', '', 'admin', '202400001', 'Coordenador do laboratório de inovação tecnológica.', '2024-01-10');

INSERT IGNORE INTO projetos (projeto_id, logo, titulo, descricao, status, area, criado_em, atualizado_em, dono_id, prazo_final)
VALUES
  ('p1', '', 'SmartCampus IoT', 'Sistema de monitoramento inteligente do campus universitário utilizando sensores IoT.', 'andamento', 'Internet das Coisas', '2024-06-01', '2025-01-15', 'u1', '2025-07-30'),
  ('p2', '', 'MedIA - Diagnóstico Assistido', 'Aplicação de redes neurais convolucionais para auxílio no diagnóstico de imagens médicas.', 'concluido', 'Inteligência Artificial', '2024-02-10', '2024-12-20', 'u1', '2024-12-15');

INSERT IGNORE INTO projeto_membros (projeto_id, usuario_id)
VALUES
  ('p1', 'u1'),
  ('p2', 'u1');

INSERT IGNORE INTO projeto_documentos (documento_id, projeto_id, url_arquivo, nome_arquivo, enviado_por, data_envio)
VALUES
  ('d1', 'p1', '#', 'Arquitetura_IoT_SmartCampus.pdf', 'u1', '2024-07-15'),
  ('d2', 'p2', '#', 'Artigo_MedIA_Final.pdf', 'u1', '2024-12-10');
