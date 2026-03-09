import { Project } from '@/types';
import StatusBadge from './StatusBadge';
import { Link } from 'react-router-dom';
import { Calendar, Layers } from 'lucide-react';
import defaultLogo from '@/assets/default-project-logo.png';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Link
      to={`/projeto/${project.projeto_id}`}
      className="group block rounded-lg border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
    >
      <div className="flex items-start gap-4">
        <img
          src={project.logo || defaultLogo}
          alt={project.titulo}
          className="h-12 w-12 rounded-lg object-contain bg-surface-subtle p-1 shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-display font-semibold text-base text-card-foreground group-hover:text-primary transition-colors truncate">
              {project.titulo}
            </h3>
            <StatusBadge status={project.status} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {project.descricao}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5" />
              {project.area}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {project.prazo_final}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
