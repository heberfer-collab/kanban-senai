import { useAuthStore } from '../store/authStore';
import { User, Mail, LogOut, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Meu Perfil</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Gerencie suas informações e conta.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card Principal do Perfil */}
        <div className="md:col-span-2 bg-white dark:bg-bg-dark-card rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center sm:flex-row gap-8">
          <div className="relative">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-32 h-32 rounded-full object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border-4 border-slate-50 dark:border-slate-800 shadow-md">
                <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <button className="absolute bottom-0 right-0 bg-white dark:bg-slate-700 p-2 rounded-full shadow-md border border-slate-100 dark:border-slate-600 text-slate-600 hover:text-primary-600 transition-colors">
              <User className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-slate-500 dark:text-slate-400 mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap gap-4 justify-center sm:justify-start">
              <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Membro Pro</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <Clock className="w-4 h-4 text-primary-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Desde 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Ações */}
        <div className="bg-white dark:bg-bg-dark-card rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Ações da Conta</h3>
          
          <div className="flex-1 space-y-3">
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              Editar Perfil
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              Alterar Senha
            </button>
            <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 font-medium transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
              Notificações
            </button>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-medium transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
