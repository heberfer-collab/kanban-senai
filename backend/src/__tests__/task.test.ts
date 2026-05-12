import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../server';
import { prisma } from '../lib/prisma';
import jwt from 'jsonwebtoken';

// Mock do Prisma
vi.mock('../lib/prisma', () => ({
  prisma: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findUnique: vi.fn(),
    },
    tag: {
      findFirst: vi.fn(),
      create: vi.fn(),
    }
  },
}));

// Mock do JWT
vi.mock('jsonwebtoken', () => ({
  default: {
    verify: vi.fn().mockReturnValue({ userId: 'user-123' }),
    sign: vi.fn().mockReturnValue('mocked-token'),
  },
}));

describe('Task Controller', () => {
  const mockToken = 'Bearer valid-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('deve retornar a lista de tarefas do usuário logado', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', userId: 'user-123', tags: [] },
        { id: '2', title: 'Task 2', userId: 'user-123', tags: [] },
      ];

      (prisma.task.findMany as any).mockResolvedValue(mockTasks);

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', mockToken);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(prisma.task.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { userId: 'user-123' }
      }));
    });

    it('deve retornar 401 se não houver token', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/tasks', () => {
    it('deve criar uma nova tarefa', async () => {
      const newTask = { title: 'New Task', description: 'Test Desc' };
      const createdTask = { id: 'task-999', ...newTask, userId: 'user-123', tags: [] };

      (prisma.task.create as any).mockResolvedValue(createdTask);

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', mockToken)
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
      expect(prisma.task.create).toHaveBeenCalled();
    });
  });
});
