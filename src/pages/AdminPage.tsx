import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Project, ProjectStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatusBadge from '@/components/StatusBadge';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [area, setArea] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('disponivel');
  const [logo, setLogo] = useState('');
  const [prazoFinal, setPrazoFinal] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadProjects();
  }, [isAdmin, navigate]);

  const loadProjects = async () => {
    const data = await api.getProjects();
    setProjects(data);
  };

  const resetForm = () => {
    setTitulo(''); setDescricao(''); setArea(''); setStatus('disponivel'); setLogo(''); setPrazoFinal('');
    setEditingId(null); setShowForm(false);
  };

  const handleEdit = (p: Project) => {
    setTitulo(p.titulo); setDescricao(p.descricao); setArea(p.area); setStatus(p.status); setLogo(p.logo); setPrazoFinal(p.prazo_final);
    setEditingId(p.projeto_id); setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await api.deleteProject(id);
    toast.success('Projeto removido.');
    loadProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await api.updateProject(editingId, { titulo, descricao, area, status, logo, prazo_final: prazoFinal });
      toast.success('Projeto atualizado.');
    } else {
      await api.createProject({ titulo, descricao, area, status, logo, prazo_final: prazoFinal, dono_id: user!.usuario_id });
      toast.success('Projeto criado.');
    }
    resetForm();
    loadProjects();
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold">Painel Admin</h1>
          <p className="text-muted-foreground text-sm">Gerencie os projetos da plataforma.</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> Novo Projeto
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-card animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">{editingId ? 'Editar Projeto' : 'Novo Projeto'}</h2>
            <Button variant="ghost" size="sm" onClick={resetForm}><X className="h-4 w-4" /></Button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input value={titulo} onChange={e => setTitulo(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Área</Label>
                <Input value={area} onChange={e => setArea(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={3} required />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Prazo Final</Label>
                <Input type="date" value={prazoFinal} onChange={e => setPrazoFinal(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>URL do Logo</Label>
                <Input value={logo} onChange={e => setLogo(e.target.value)} placeholder="Opcional" />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit">{editingId ? 'Salvar' : 'Criar Projeto'}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
            </div>
          </form>
        </div>
      )}

      {/* Project list */}
      <div className="space-y-2">
        {projects.map(p => (
          <div key={p.projeto_id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm truncate">{p.titulo}</span>
                <StatusBadge status={p.status} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{p.area}</p>
            </div>
            <div className="flex gap-1 shrink-0 ml-3">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(p.projeto_id)} className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
