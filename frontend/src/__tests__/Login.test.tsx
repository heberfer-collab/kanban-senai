import { render, screen } from '@testing-library/react';
import { Login } from '../pages/Login';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Mock do useNavigate
const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedUsedNavigate,
  };
});

// Mock do authStore
vi.mock('../store/authStore', () => ({
  useAuthStore: (selector: any) => {
    const state = {
      login: vi.fn(),
    };
    return selector(state);
  },
}));

describe('Login Page', () => {
  it('deve renderizar os campos de email e senha', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('deve alternar entre login e cadastro', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    const toggleButton = screen.getByText(/cadastre-se agora/i);
    toggleButton.click();

    expect(screen.getByPlaceholderText('Seu nome')).toBeInTheDocument();
    expect(screen.getByText(/já tem uma conta\?/i)).toBeInTheDocument();
  });
});
