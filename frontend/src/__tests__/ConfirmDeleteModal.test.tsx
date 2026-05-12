import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import { describe, it, expect, vi } from 'vitest';

describe('ConfirmDeleteModal', () => {
  it('não deve renderizar se isOpen for false', () => {
    const { container } = render(
      <ConfirmDeleteModal 
        isOpen={false} 
        onClose={() => {}} 
        onConfirm={() => {}} 
        title="Teste" 
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('deve exibir o título da tarefa corretamente', () => {
    render(
      <ConfirmDeleteModal 
        isOpen={true} 
        onClose={() => {}} 
        onConfirm={() => {}} 
        title="Minha Tarefa" 
      />
    );
    expect(screen.getByText(/Minha Tarefa/i)).toBeInTheDocument();
  });

  it('deve chamar onConfirm quando o botão de excluir for clicado', () => {
    const onConfirm = vi.fn();
    render(
      <ConfirmDeleteModal 
        isOpen={true} 
        onClose={() => {}} 
        onConfirm={onConfirm} 
        title="Teste" 
      />
    );

    fireEvent.click(screen.getByText(/Sim, Excluir/i));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('deve chamar onClose quando o botão cancelar for clicado', () => {
    const onClose = vi.fn();
    render(
      <ConfirmDeleteModal 
        isOpen={true} 
        onClose={onClose} 
        onConfirm={() => {}} 
        title="Teste" 
      />
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
