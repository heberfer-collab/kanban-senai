import { AlertTriangle } from 'lucide-react';

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, title: string }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white dark:bg-bg-dark-card rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-100 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Excluir Tarefa?</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            Tem certeza que deseja excluir a tarefa "{title}"? Esta ação não poderá ser desfeita.
          </p>
          
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="flex-1 py-2.5 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }}
              className="flex-1 py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-rose-500/20"
            >
              Sim, Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
