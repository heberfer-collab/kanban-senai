import { useState, useMemo } from 'react';
import { useAuthStore } from '../store/authStore';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { CheckSquare, Clock, AlertCircle, TrendingUp, Plus, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export function Dashboard() {
  const user = useAuthStore(state => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data } = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      const res = await api.get('/dashboard/metrics');
      return res.data;
    }
  });

  const metrics = data?.metrics;
  const upcomingTasks = data?.upcomingTasks || [];
  const chartData = data?.chartData || [];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden text-slate-100">
      {/* Efeitos de Luz de Fundo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />

      <div className="relative p-8 space-y-8 w-full max-w-7xl mx-auto z-10">
        <header className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            {greeting}, {firstName}! 👋
          </h1>
          <p className="text-slate-400 text-lg">Aqui está o seu resumo de produtividade.</p>
        </header>

        {/* Cards de Métricas (Glassmorphism) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard title="Concluídas (7 Dias)" value={metrics?.completedLast7Days || "0"} icon={<TrendingUp className="text-emerald-400" />} />
          <GlassCard title="Total de Tarefas" value={metrics?.totalTasks || "0"} icon={<CheckSquare className="text-blue-400" />} />
          <GlassCard title="Para Hoje" value={metrics?.todayTasks || "0"} icon={<Clock className="text-amber-400" />} />
          <GlassCard title="Atrasadas" value={metrics?.overdueTasks || "0"} icon={<AlertCircle className="text-rose-400" />} urgent />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/50">
            <h3 className="text-lg font-semibold mb-6 text-white">Distribuição por Categoria</h3>
            {chartData.length > 0 ? (
              <>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {chartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
                  {chartData.map((item: any) => (
                    <div key={item.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-slate-300 font-medium">{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">Nenhuma tarefa criada.</div>
            )}
          </div>

          {/* Lista de Próximas Tarefas */}
          <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl shadow-black/50 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-400" />
                Próximas a Vencer
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-white/10">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task: any) => (
                  <div key={task.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100 group-hover:text-primary-300 transition-colors">{task.title}</h4>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {new Date(task.dueDate).toLocaleDateString('pt-BR')} 
                          <span className="mx-2">•</span> 
                          <span className="text-primary-400/80">{task.category}</span>
                        </p>
                      </div>
                    </div>
                    {task.priority === 'HIGH' && (
                      <span className="px-3 py-1 text-xs font-bold bg-rose-500/20 text-rose-300 rounded-full border border-rose-500/30">
                        Urgente
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
                  <CheckSquare className="w-12 h-12 mb-3 opacity-20" />
                  <p>Tudo tranquilo! Nenhuma tarefa pendente próxima do prazo.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Botão Flutuante (FAB) */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-gradient-to-tr from-primary-600 to-emerald-500 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 group"
      >
        <Plus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
      </button>

      <CreateTaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function GlassCard({ title, value, icon, urgent = false }: { title: string, value: string | number, icon: React.ReactNode, urgent?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-white/5 backdrop-blur-xl rounded-3xl p-6 border shadow-xl ${urgent ? 'border-rose-500/30 shadow-rose-500/10' : 'border-white/10 shadow-black/50'}`}>
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">{title}</p>
          <h2 className="text-4xl font-extrabold text-white">{value}</h2>
        </div>
        <div className={`p-3 rounded-2xl ${urgent ? 'bg-rose-500/20' : 'bg-white/5'}`}>
          {icon}
        </div>
      </div>
      {urgent && <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full pointer-events-none" />}
    </div>
  );
}
