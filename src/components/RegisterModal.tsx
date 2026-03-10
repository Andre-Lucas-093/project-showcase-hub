import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/services/api';
import { toast } from 'sonner';

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RegisterModal = ({ open, onOpenChange }: RegisterModalProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [matricula, setMatricula] = useState('');
  const [genero, setGenero] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setMatricula('');
    setGenero('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await api.register({ nome, email, papel: 'mentor', bio_perfil: `Matrícula: ${matricula}` });
      if (user) {
        toast.success('Cadastro realizado com sucesso! Agora você pode fazer login.');
        resetForm();
        onOpenChange(false);
      } else {
        toast.error('Este e-mail já está cadastrado.');
      }
    } catch {
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Criar Conta</DialogTitle>
          <DialogDescription>Cadastro exclusivo para professores da instituição.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="reg-matricula">Matrícula do professor</Label>
            <Input
              id="reg-matricula"
              value={matricula}
              onChange={e => setMatricula(e.target.value)}
              placeholder="Ex: 202600123"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-nome">Nome completo</Label>
            <Input
              id="reg-nome"
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="Seu nome"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">E-mail institucional</Label>
            <Input
              id="reg-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-senha">Senha</Label>
            <Input
              id="reg-senha"
              type="password"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-genero">Gênero</Label>
            <Select value={genero} onValueChange={setGenero} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md bg-muted px-3 py-2">
            <p className="text-xs text-muted-foreground">
              <strong>Papel:</strong> Professor
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Cadastrando...' : 'Criar Conta'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
