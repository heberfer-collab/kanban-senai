import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tags, Edit2, Trash2, Save, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export function Categories() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const { data: tags = [], isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await api.get('/tags');
      return res.data;
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      return api.put(`/tags/${id}`, { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setEditingId(null);
      showNotification('Categoria atualizada!');
    },
    onError: () => {
      showNotification('Erro ao atualizar categoria.', 'error');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/tags/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      showNotification('Categoria excluída!');
    },
    onError: () => {
      showNotification('Erro ao excluir categoria.', 'error');
    }
  });

  const handleEdit = (tag: any) => {
    setEditingId(tag.id);
    setEditName(tag.name);
  };

  const handleSave = (id: string) => {
    if (!editName.trim()) return;
    updateMutation.mutate({ id, name: editName.trim() });
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center dark:text-white gap-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-medium text-slate-500 animate-pulse">Carregando categorias...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-bg-dark">
      <header className="px-8 py-6 bg-white/60 dark:bg-bg-dark-card/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
            <Tags className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Categorias (Tags)</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gerencie as etiquetas usadas nas suas tarefas.
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto">
          {tags.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Tags className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Nenhuma categoria encontrada</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
                Você ainda não tem categorias (tags). Elas são criadas automaticamente quando você digita uma tag ao criar uma nova tarefa!
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-bg-dark-card rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-600 dark:text-slate-400">
                    <th className="px-6 py-4">Nome da Categoria</th>
                    <th className="px-6 py-4">Tarefas Associadas</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {tags.map((tag: any) => (
                    <tr key={tag.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4">
                        {editingId === tag.id ? (
                          <input
                            type="text"
                            autoFocus
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSave(tag.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            className="px-3 py-1.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-900 dark:text-white"
                          />
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            <Tags className="w-3.5 h-3.5 text-slate-400" />
                            {tag.name}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                          {tag._count?.tasks || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === tag.id ? (
                            <>
                              <button onClick={() => setEditingId(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" title="Cancelar">
                                <X className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleSave(tag.id)} className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors rounded-lg" title="Salvar">
                                <Save className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(tag)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 transition-colors rounded-lg" title="Editar">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(tag.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-500/10 transition-colors rounded-lg" title="Excluir">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sistema de Notificação (Toast) */}
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
          <div className={`px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md border flex items-center gap-3 ${
            notification.type === 'success' 
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
              : 'bg-rose-500/20 border-rose-500/30 text-rose-400'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
