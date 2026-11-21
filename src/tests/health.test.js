const request = require('supertest');
const app = require('../app');

describe('Infraestrutura e Disponibilidade da API', () => {
  it('[CT-FUN-00] – Deve retornar status UP ao consultar /api/health', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'UP',
      message: 'Nexus API is running on PostgreSQL',
    });
  });
});
