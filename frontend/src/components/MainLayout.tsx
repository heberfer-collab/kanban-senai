import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Tags } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Início', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Minhas Tarefas', path: '/tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { name: 'Categorias', path: '/categories', icon: <Tags className="w-5 h-5" /> },
    { name: 'Configurações', path: '/profile', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-bg-dark">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-bg-dark-card flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Kanban Logo" className="w-8 h-8 object-contain drop-shadow-md rounded" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-emerald-500 bg-clip-text text-transparent">Kanban</h1>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 w-full rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
          >
            <LogOut className="w-4 h-4" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
