import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Shield, Beaker, Moon, Sun } from 'lucide-react';

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title="Alternar tema"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Alternar tema</span>
    </Button>
  )
}

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
          <Beaker className="h-5 w-5 text-primary" />
          Extensão Unifeso
        </Link>

        <nav className="flex items-center gap-3">
          <ModeToggle />
          {isAdmin && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin')} className="gap-1.5 text-sm">
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          )}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.nome} <span className="text-xs opacity-70">({user.papel})</span>
              </span>
              <Button variant="outline" size="sm" onClick={logout} className="gap-1.5">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          ) : (
            <Button variant="default" size="sm" onClick={() => navigate('/login')} className="gap-1.5">
              <LogIn className="h-4 w-4" />
              Entrar
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
