import { User } from '@/types';

export const mockUsers: User[] = [
  {
    usuario_id: 'u1',
    nome: 'Carlos Admin',
    email: 'admin@projeto.com',
    papel: 'admin',
    bio_perfil: 'Coordenador do laboratório de inovação tecnológica.',
    data_cadastro: '2024-01-10',
  },
  {
    usuario_id: 'u2',
    nome: 'Ana Silva',
    email: 'ana@aluno.com',
    papel: 'aluno',
    bio_perfil: 'Estudante de Ciência da Computação, focada em IA.',
    data_cadastro: '2024-03-15',
  },
  {
    usuario_id: 'u3',
    nome: 'Prof. Roberto Lima',
    email: 'roberto@mentor.com',
    papel: 'mentor',
    bio_perfil: 'Professor doutor em Engenharia de Software com 15 anos de experiência.',
    data_cadastro: '2024-02-01',
  },
];
