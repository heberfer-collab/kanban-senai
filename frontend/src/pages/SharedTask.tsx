import { Clock, Tag as TagIcon, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SharedTask() {

  // Mock data por enquanto. Numa aplicação real, faremos fetch(`/api/shared/${token}`)
  const mockSharedTask = {
    title: 'Planejar sprint do mês',
    description: 'Revisar backlog e alinhar com as metas da diretoria. Também precisamos fechar o orçamento do próximo trimestre e revisar as pendências de design.',
    priority: 'HIGH',
    category: 'TRABALHO',
    isDone: false,
    date: '10 de Outubro',
    tags: ['Reunião', 'Estratégico'],
    owner: {
      name: 'Heber',
      avatarUrl: 'https://ui-avatars.com/api/?name=Heber&background=random'
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-bg-dark flex flex-col items-center justify-center p-4">
      {/* Header Fixo */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
            <CheckCircle className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Kanban</span>
        </div>
        <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary-600 transition-colors bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
          Criar minha conta
        </Link>
      </div>

      <div className="w-full max-w-2xl bg-white/80 dark:bg-bg-dark-card/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/50 p-8 sm:p-12 relative z-10">
        
        <div className="flex justify-between items-start mb-6">
          <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {mockSharedTask.category}
          </span>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700/50 text-sm font-medium">
            <Clock className="w-4 h-4" />
            {mockSharedTask.date}
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
          {mockSharedTask.title}
        </h1>

        <div className="flex items-center gap-3 mb-8 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
          <img src={mockSharedTask.owner.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full shadow-sm" />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Compartilhado por</p>
            <p className="font-semibold text-slate-900 dark:text-white leading-none">{mockSharedTask.owner.name}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2 uppercase tracking-wider">
              <AlignLeft className="w-4 h-4 text-slate-400" /> Descrição
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50">
              {mockSharedTask.description}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2 uppercase tracking-wider">
              <TagIcon className="w-4 h-4 text-slate-400" /> Tags Associadas
            </h3>
            <div className="flex flex-wrap gap-2">
              {mockSharedTask.tags.map(tag => (
                <span key={tag} className="bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400 px-3 py-1.5 rounded-lg text-sm font-medium border border-primary-100 dark:border-primary-500/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Este é um link público de visualização. Você não pode editar esta tarefa.
          </p>
        </div>
      </div>

      {/* Decoração de Fundo */}
      <div className="fixed top-1/4 -left-64 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 -right-64 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}

function AlignLeft(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="21" x2="3" y1="6" y2="6"/>
      <line x1="15" x2="3" y1="12" y2="12"/>
      <line x1="17" x2="3" y1="18" y2="18"/>
    </svg>
  );
}
