import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server';

describe('Server Health Check', () => {
  it('deve retornar 404 para rotas inexistentes', async () => {
    const response = await request(app).get('/api/not-found');
    expect(response.status).toBe(404);
  });

  it('deve ter os headers de segurança do helmet', async () => {
    const response = await request(app).get('/api/auth/login');
    // Mesmo que retorne 404 ou 405, o helmet deve adicionar headers
    expect(response.headers).toHaveProperty('x-content-type-options');
    expect(response.headers).toHaveProperty('x-frame-options');
  });
});
