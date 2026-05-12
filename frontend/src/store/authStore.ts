import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('kanban_user') || 'null'),
  token: localStorage.getItem('kanban_token'),
  login: (user, token) => {
    localStorage.setItem('kanban_token', token);
    localStorage.setItem('kanban_user', JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('kanban_token');
    localStorage.removeItem('kanban_user');
    set({ user: null, token: null });
  },
}));
