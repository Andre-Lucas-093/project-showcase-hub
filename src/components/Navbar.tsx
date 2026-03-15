import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { NavBar } from '@/components/ui/tubelight-navbar';
import { LogIn, LogOut, Shield, Briefcase, Users, FileText } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Projetos', url: '/', icon: Briefcase },
    { name: 'Usuários', url: '#', icon: Users },
    { name: 'Documentações', url: '#', icon: FileText }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between relative">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg text-foreground">
          <img src="/favicon.png" alt="Logo Unifeso" className="h-6 w-6" />
          Extensão Unifeso
        </Link>
        
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
           <NavBar items={navItems} className="!relative !left-0 !transform-none !pt-0 !mb-0" />
        </div>

        <nav className="flex items-center gap-3">
          <ThemeToggle />
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
            <GradientButton size="sm" onClick={() => navigate('/login')} className="gap-1.5 px-4 h-9">
              <LogIn className="h-4 w-4" />
              Login
            </GradientButton>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
