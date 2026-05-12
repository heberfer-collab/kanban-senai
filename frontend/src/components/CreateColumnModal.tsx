import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

interface CreateColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateColumnModal({ isOpen, onClose }: CreateColumnModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const queryClient = useQueryClient();

  const createColumnMutation = useMutation({
    mutationFn: async (title: string) => {
      return api.post('/columns', { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['columns'] });
      setTitle('');
      setError('');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Erro ao criar coluna');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('O nome da coluna é obrigatório');
      return;
    }
    createColumnMutation.mutate(title.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-white dark:bg-bg-dark-card rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">Nova Coluna</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Organize seu fluxo de trabalho</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-500/20">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Nome da Coluna
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Em Testes, Aguardando Aprovação..."
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={createColumnMutation.isPending}
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm shadow-indigo-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {createColumnMutation.isPending ? 'Criando...' : 'Criar Coluna'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
