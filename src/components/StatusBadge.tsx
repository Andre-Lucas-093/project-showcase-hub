import { ProjectStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  disponivel: { label: 'Disponível', className: 'bg-status-available/15 text-status-available border-status-available/30' },
  andamento: { label: 'Em Andamento', className: 'bg-status-ongoing/15 text-status-ongoing border-status-ongoing/30' },
  concluido: { label: 'Concluído', className: 'bg-status-completed/15 text-status-completed border-status-completed/30' },
};

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('font-medium text-xs border', config.className, className)}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
