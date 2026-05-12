import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server';
import { prisma } from '../lib/prisma';
import bcrypt from 'bcrypt';

// Mock do Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock do bcrypt para acelerar os testes
vi.mock('bcrypt', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed_password'),
    compare: vi.fn(),
  },
}));

describe('Auth Controller', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const userData = { email: 'test@example.com', password: 'password123', name: 'Test User' };
      
      // Simula que o usuário não existe
      (prisma.user.findUnique as any).mockResolvedValue(null);
      // Simula a criação do usuário
      (prisma.user.create as any).mockResolvedValue({
        id: 'user-id',
        ...userData,
        avatarUrl: 'http://avatar.url'
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('deve falhar se o e-mail já existir', async () => {
      const userData = { email: 'existing@example.com', password: 'password123', name: 'Existing User' };
      
      // Simula que o usuário JÁ existe
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing-id', ...userData });

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('E-mail já cadastrado.');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com sucesso', async () => {
      const loginData = { email: 'test@example.com', password: 'password123' };
      const dbUser = { id: 'user-id', email: 'test@example.com', password: 'hashed_password', name: 'Test User' };

      (prisma.user.findUnique as any).mockResolvedValue(dbUser);
      (bcrypt.compare as any).mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });

    it('deve falhar com credenciais inválidas', async () => {
      const loginData = { email: 'test@example.com', password: 'wrong_password' };
      
      (prisma.user.findUnique as any).mockResolvedValue({ id: 'user-id', password: 'hashed_password' });
      (bcrypt.compare as any).mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData);

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Credenciais inválidas.');
    });
  });
});
