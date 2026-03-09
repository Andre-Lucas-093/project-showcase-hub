import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '@/services/api';
import { Project, User, ProjectDocument } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User as UserIcon, FileText, Download, Eye, Layers } from 'lucide-react';
import defaultLogo from '@/assets/default-project-logo.png';

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.getProject(id),
      api.getProjectDocuments(id),
    ]).then(async ([proj, docs]) => {
      setProject(proj || null);
      setDocuments(docs);
      if (proj) {
        const o = await api.getUser(proj.dono_id);
        setOwner(o || null);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="container py-16 text-center text-muted-foreground">Carregando...</div>;
  if (!project) return <div className="container py-16 text-center text-muted-foreground">Projeto não encontrado.</div>;

  return (
    <div className="container py-8 max-w-4xl">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="bg-card border border-border rounded-lg p-6 sm:p-8 shadow-card">
        <div className="flex items-start gap-5 mb-6">
          <img src={project.logo || defaultLogo} alt={project.titulo} className="h-16 w-16 rounded-lg object-contain bg-surface-subtle p-1.5 shrink-0" />
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="font-display text-2xl sm:text-3xl font-bold">{project.titulo}</h1>
              <StatusBadge status={project.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Layers className="h-4 w-4" />{project.area}</span>
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Prazo: {project.prazo_final}</span>
            </div>
          </div>
        </div>

        <p className="text-foreground/90 leading-relaxed mb-8">{project.descricao}</p>

        {/* Owner */}
        <div className="mb-8">
          <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Dono do Projeto</h2>
          {owner && (
            <div className="flex items-center gap-3 p-3 bg-surface-subtle rounded-lg max-w-xs">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">{owner.nome}</p>
                <p className="text-xs text-muted-foreground">{owner.papel}</p>
              </div>
            </div>
          )}
        </div>

        {/* Documents */}
        {documents.length > 0 && (
          <div>
            <h2 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Documentos</h2>
            <div className="space-y-2">
              {documents.map(doc => (
                <div key={doc.documento_id} className="flex items-center justify-between p-3 bg-surface-subtle rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{doc.nome_arquivo}</p>
                      <p className="text-xs text-muted-foreground">Enviado em {doc.data_envio}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;
