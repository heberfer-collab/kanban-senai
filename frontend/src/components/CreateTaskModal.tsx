import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

export function CreateTaskModal({ isOpen, onClose, task, columns = [] }: { isOpen: boolean, onClose: () => void, task?: any, columns?: any[] }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('TRABALHO');
  const [status, setStatus] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setPriority(task.priority);
        setCategory(task.category);
        setStatus(task.status);
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setTags(task.tags?.map((t: any) => t.tag.name) || []);
      } else {
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setCategory('TRABALHO');
        setDueDate('');
        setTags([]);
        // Define o status inicial apenas se ainda não estiver definido e houver colunas
        if (columns.length > 0 && !status) {
          setStatus(columns[0].id);
        }
      }
      setErrorMsg('');
    }
  }, [isOpen, task, columns, status]);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (task) {
        return api.put(`/tasks/${task.id}`, data);
      }
      return api.post('/tasks', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error: any) => {
      setErrorMsg(error.response?.data?.error || 'Ocorreu um erro ao salvar a tarefa. Tente novamente.');
    }
  });

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('O Título da tarefa é obrigatório.');
      return;
    }
    mutation.mutate({ title, description, priority, category, status, dueDate, tagNames: tags });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white dark:bg-bg-dark-card rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{task ? 'Editar Tarefa' : 'Nova Tarefa'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 text-sm text-rose-600 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Tarefa *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Enviar relatório financeiro"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição</label>
            <textarea 
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalhes adicionais..."
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white custom-scrollbar resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prioridade</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
              >
                <option value="LOW">Baixa</option>
                <option value="MEDIUM">Média</option>
                <option value="HIGH">Alta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Situação (Coluna)</label>
              <select 
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
              >
                {columns.length === 0 ? (
                  <option value="">Carregando colunas...</option>
                ) : (
                  columns.map(col => (
                    <option key={col.id} value={col.id}>{col.title}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Categoria</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
              >
                <option value="TRABALHO">Trabalho</option>
                <option value="PESSOAL">Pessoal</option>
                <option value="ESTUDOS">Estudos</option>
                <option value="CASA">Casa</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Data de Entrega</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tags <span className="text-slate-400 font-normal">(Aperte Enter)</span>
            </label>
            <div className="p-2 min-h-[50px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-primary-500 transition-all">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input 
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? "Adicione tags..." : ""}
                className="flex-1 bg-transparent min-w-[100px] outline-none text-sm text-slate-900 dark:text-white px-1"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-primary-500/20"
            >
              {mutation.isPending ? 'Salvando...' : task ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
