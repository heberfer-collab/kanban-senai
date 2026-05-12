import { Plus, MoreVertical, Clock, Tag as TagIcon, AlignLeft, Share2, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import useSound from 'use-sound';
import { api } from '../services/api';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { CreateColumnModal } from '../components/CreateColumnModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { useAuthStore } from '../store/authStore';
import { STABLE_SOUND_URLS } from '../constants/sounds';

export function Tasks() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<any>(null);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const queryClient = useQueryClient();
  const user = useAuthStore(state => state.user);

  // Sons
  const [playDrag] = useSound(STABLE_SOUND_URLS.DRAG, { volume: 0.5 });
  const [playDrop] = useSound(STABLE_SOUND_URLS.DROP, { volume: 0.5 });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const { data: tasks = [], isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await api.get('/tasks');
      return res.data;
    }
  });

  const { data: columns = [], isLoading: isLoadingColumns } = useQuery({
    queryKey: ['columns'],
    queryFn: async () => {
      const res = await api.get('/columns');
      return res.data;
    }
  });

  // Mutação Otimista para Mudança de Status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      return api.put(`/tasks/${id}`, { status });
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old: any[]) => 
        old.map(task => task.id === id ? { ...task, status } : task)
      );
      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      showNotification('Erro ao mover tarefa.', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete(`/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      showNotification('Tarefa excluída com sucesso!');
      setTaskToDelete(null);
    },
    onError: () => {
      showNotification('Erro ao excluir tarefa.', 'error');
    }
  });

  const onDragStart = useCallback(() => {
    playDrag();
  }, [playDrag]);

  const onDragEnd = useCallback((result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    playDrop();
    updateStatusMutation.mutate({ id: draggableId, status: destination.droppableId });
  }, [updateStatusMutation, playDrop]);

  const handleEdit = (task: any) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(false);
  };

  const handleShare = async (id: string) => {
    try {
      const res = await api.post(`/tasks/${id}/share`);
      const link = `${window.location.origin}/shared/${res.data.shareToken}`;
      await navigator.clipboard.writeText(link);
      showNotification('Link de compartilhamento copiado!');
    } catch (error) {
      showNotification('Erro ao compartilhar a tarefa.', 'error');
    }
  };

  const isLoading = isLoadingTasks || isLoadingColumns;

  if (isLoading) return (
    <div className="h-full flex flex-col items-center justify-center dark:text-white gap-4">
      <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      <p className="font-medium text-slate-500 animate-pulse">Buscando suas tarefas...</p>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-bg-dark">
      {/* Cabeçalho Premium Fixo */}
      <header className="px-8 py-6 bg-white/60 dark:bg-bg-dark-card/60 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shrink-0 z-10 sticky top-0">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Seu Kanban</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Arraste e solte para organizar sua produtividade.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="shrink-0 bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm shadow-primary-500/30 flex items-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Nova Tarefa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Área do Kanban com DragDropContext */}
      <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto overflow-y-hidden p-8 custom-scrollbar">
          <div className="flex gap-6 h-full max-w-[1600px] mx-auto items-start">
            {columns.map((column: any) => (
              <KanbanColumn 
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={tasks.filter((t: any) => t.status === column.id)}
                colorBorder={column.colorBorder}
                bgColor={column.bgColor}
                onEdit={handleEdit}
                onDelete={setTaskToDelete}
                onShare={handleShare}
                user={user}
                onAddClick={() => setIsModalOpen(true)}
              />
            ))}
            
            <button 
              onClick={() => setIsColumnModalOpen(true)}
              className="w-80 shrink-0 h-24 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-200 transition-colors gap-2 font-medium"
            >
              <Plus className="w-5 h-5" />
              Nova Coluna
            </button>
          </div>
        </div>
      </DragDropContext>
      
      <CreateTaskModal isOpen={isModalOpen} onClose={handleCloseModal} task={taskToEdit} columns={columns} />
      <CreateColumnModal isOpen={isColumnModalOpen} onClose={() => setIsColumnModalOpen(false)} />
      <ConfirmDeleteModal 
        isOpen={!!taskToDelete} 
        onClose={() => setTaskToDelete(null)} 
        title={taskToDelete?.title || ''}
        onConfirm={() => deleteMutation.mutate(taskToDelete.id)} 
      />

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

function KanbanColumn({ id, title, tasks, colorBorder, bgColor, onEdit, onDelete, onShare, user, onAddClick }: any) {
  return (
    <div className={`w-80 shrink-0 flex flex-col ${bgColor} border-t-4 ${colorBorder} rounded-2xl max-h-full shadow-sm`}>
      <div className="p-4 flex items-center justify-between shrink-0">
        <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          {title}
          <span className="bg-white/60 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 text-xs py-0.5 px-2.5 rounded-full font-semibold shadow-sm">
            {tasks.length}
          </span>
        </h3>
        <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 dark:hover:text-slate-200 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div 
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-1 overflow-y-auto px-4 pb-4 space-y-3 custom-scrollbar transition-colors ${snapshot.isDraggingOver ? 'bg-primary-500/5' : ''}`}
          >
            {tasks.map((task: any, index: number) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`group bg-white dark:bg-bg-dark-card p-4 rounded-xl border shadow-sm hover:shadow-md transition-all relative ${
                      snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 border-primary-500' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {/* Header do Card */}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                        task.priority === 'HIGH' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400' :
                        task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                        'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                      }`}>
                        {task.priority}
                      </span>
                      
                      {/* Ações */}
                      <div className="flex gap-1 ml-auto">
                        <button 
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-emerald-600 transition-opacity"
                          title="Compartilhar"
                          onClick={() => onShare(task.id)}
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        <button 
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-blue-600 transition-opacity ml-1"
                          title="Editar"
                          onClick={() => onEdit(task)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button 
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity ml-1"
                          title="Excluir"
                          onClick={() => onDelete(task)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2 text-sm leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {task.tags.map((t: any) => (
                          <span key={t.tag.name} className="flex items-center gap-1 text-[10px] font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            <TagIcon className="w-3 h-3" />
                            {t.tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sem data'}
                      </div>
                      <div className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center border border-white dark:border-slate-800 overflow-hidden">
                        {user?.avatarUrl ? (
                          <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] font-bold text-primary-600 dark:text-primary-400">
                            {user?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="px-4 pb-4">
        <button 
          onClick={onAddClick}
          className="w-full py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-700/50 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>
    </div>
  );
}
