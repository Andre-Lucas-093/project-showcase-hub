import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Beaker } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      toast.success('Login realizado com sucesso!');
      navigate('/');
    } else {
      toast.error('E-mail não encontrado. Tente: admin@projeto.com, ana@aluno.com ou roberto@mentor.com');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10 mb-4">
            <Beaker className="h-6 w-6 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Entrar</h1>
          <p className="text-sm text-muted-foreground mt-1">Acesse sua conta no ProjetoExpo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 p-3 bg-surface-subtle rounded-lg text-xs text-muted-foreground">
          <p className="font-medium mb-1">Conta de teste:</p>
          <p>admin@projeto.com (admin)</p>
          <p className="mt-1 opacity-70">Qualquer senha funciona.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
