import type { ProjectDocument } from '../types/index.js';

let documents: ProjectDocument[] = [
  {
    documento_id: 'd1',
    projeto_id: 'p1',
    url_arquivo: '#',
    nome_arquivo: 'Arquitetura_IoT_SmartCampus.pdf',
    enviado_por: 'u1',
    data_envio: '2024-07-15',
  },
  {
    documento_id: 'd2',
    projeto_id: 'p2',
    url_arquivo: '#',
    nome_arquivo: 'Artigo_MedIA_Final.pdf',
    enviado_por: 'u1',
    data_envio: '2024-12-10',
  },
];

export function getByProject(projectId: string): ProjectDocument[] {
  return documents.filter(d => d.projeto_id === projectId);
}

export function insert(data: Omit<ProjectDocument, 'documento_id' | 'data_envio'>): ProjectDocument {
  const doc: ProjectDocument = {
    ...data,
    documento_id: `d${Date.now()}`,
    data_envio: new Date().toISOString().split('T')[0],
  };
  documents.push(doc);
  return doc;
}

export function deleteById(id: string): boolean {
  const len = documents.length;
  documents = documents.filter(d => d.documento_id !== id);
  return documents.length < len;
}
