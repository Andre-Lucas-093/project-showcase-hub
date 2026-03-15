-- Schema MySQL adaptado do export do drawDB.
-- aqui os valores equivalentes sao aplicados diretamente nas colunas ENUM usadas.
-- Os enums papel_membro, status_membro e status_candidatura existem no desenho,

CREATE DATABASE IF NOT EXISTS project_case
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE project_case;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS documentos;
DROP TABLE IF EXISTS projeto_documentos;
DROP TABLE IF EXISTS projeto_membros;
DROP TABLE IF EXISTS projetos;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS cursos;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE usuarios (
  usuario_id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  senha VARCHAR(255) NOT NULL,
  papel ENUM('aluno', 'mentor', 'admin') NOT NULL DEFAULT 'aluno',
  bio_perfil TEXT NULL,
  data_cadastro TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id),
  UNIQUE KEY uq_usuarios_email (email)
);

CREATE TABLE cursos (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(150) NOT NULL,
  categoria ENUM('graduacao', 'pos_graduacao') NOT NULL,
  modalidade ENUM('presencial', 'hibrido', 'ead') NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE projetos (
  projeto_id INT NOT NULL AUTO_INCREMENT,
  logo VARCHAR(255) NULL,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT NULL,
  status ENUM('concluido', 'andamento', 'disponivel') NOT NULL DEFAULT 'disponivel',
  curso_id INT NULL,
  criado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  dono_id INT NULL,
  prazo_final TIMESTAMP NULL,
  PRIMARY KEY (projeto_id),
  CONSTRAINT fk_projetos_dono_id
    FOREIGN KEY (dono_id) REFERENCES usuarios (usuario_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT fk_projetos_curso_id
    FOREIGN KEY (curso_id) REFERENCES cursos (id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE projeto_membros (
  id INT NOT NULL AUTO_INCREMENT,
  projeto_id INT NULL,
  usuario_id INT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_projeto_membros_projeto_id
    FOREIGN KEY (projeto_id) REFERENCES projetos (projeto_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
  CONSTRAINT fk_projeto_membros_usuario_id
    FOREIGN KEY (usuario_id) REFERENCES usuarios (usuario_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

CREATE TABLE documentos (
  documento_id INT NOT NULL AUTO_INCREMENT,
  projeto_id INT NULL,
  url_arquivo TEXT NOT NULL,
  enviado_por INT NULL,
  data_envio TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (documento_id),
  CONSTRAINT fk_documentos_projeto_id
    FOREIGN KEY (projeto_id) REFERENCES projetos (projeto_id)
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
);

-- Seeds para ambiente local.
INSERT INTO usuarios (usuario_id, nome, email, senha, papel, bio_perfil, data_cadastro)
VALUES
  (1, 'Carlos Admin', 'admin@projeto.com', '', 'admin', 'Coordenador do laboratorio de inovacao tecnologica.', '2024-01-10 00:00:00');

INSERT INTO cursos (id, nome, categoria, modalidade) VALUES
  (1, 'Arquitetura e Urbanismo', 'graduacao', 'presencial'),
  (2, 'Ciência da Computação', 'graduacao', 'presencial'),
  (3, 'Direito', 'graduacao', 'presencial'),
  (4, 'Enfermagem', 'graduacao', 'presencial'),
  (5, 'Engenharia Civil', 'graduacao', 'presencial'),
  (6, 'Fisioterapia', 'graduacao', 'presencial'),
  (7, 'Medicina', 'graduacao', 'presencial'),
  (8, 'Medicina Veterinária', 'graduacao', 'presencial'),
  (9, 'Nutrição', 'graduacao', 'presencial'),
  (10, 'Odontologia', 'graduacao', 'presencial'),
  (11, 'Psicologia', 'graduacao', 'presencial'),
  (12, 'Biomedicina', 'graduacao', 'presencial');

INSERT INTO projetos (projeto_id, logo, titulo, descricao, status, curso_id, criado_em, atualizado_em, dono_id, prazo_final)
VALUES
  (1, '', 'SmartCampus IoT', 'Sistema de monitoramento inteligente do campus universitario utilizando sensores IoT.', 'andamento', 2, '2024-06-01 00:00:00', '2025-01-15 00:00:00', 1, '2025-07-30 00:00:00'),
  (2, '', 'MedIA - Diagnostico Assistido', 'Aplicacao de redes neurais convolucionais para auxilio no diagnostico de imagens medicas.', 'concluido', 7, '2024-02-10 00:00:00', '2024-12-20 00:00:00', 1, '2024-12-15 00:00:00');

INSERT INTO projeto_membros (id, projeto_id, usuario_id)
VALUES
  (1, 1, 1),
  (2, 2, 1);

INSERT INTO documentos (documento_id, projeto_id, url_arquivo, enviado_por, data_envio)
VALUES
  (1, 1, 'https://example.com/documentos/arquitetura-iot-smartcampus.pdf', 1, '2024-07-15 00:00:00'),
  (2, 2, 'https://example.com/documentos/artigo-media-final.pdf', 1, '2024-12-10 00:00:00');

ALTER TABLE usuarios AUTO_INCREMENT = 2;
ALTER TABLE cursos AUTO_INCREMENT = 13;
ALTER TABLE projetos AUTO_INCREMENT = 3;
ALTER TABLE projeto_membros AUTO_INCREMENT = 3;
ALTER TABLE documentos AUTO_INCREMENT = 3;
