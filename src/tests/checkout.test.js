const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const Order = require('../models/Order');

describe('Checkout e Pedidos (/api/checkout e /api/orders)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Order.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('[CT-FUN-20] – Deve processar checkout com carrinho válido e método de pagamento', async () => {
    const response = await request(app)
      .post('/api/checkout')
      .send({
        cart: [
          { id: 1, name: 'Teclado', price: 200, qty: 1 },
          { id: 2, name: 'Mouse', price: 100, qty: 2 },
        ],
        method: 'PIX',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.orderId).toMatch(/^NX-\d+$/);
    expect(response.body.method).toBe('PIX');
    expect(response.body.itemsCount).toBe(2);
  });

  it('[CT-FUN-21] – Deve rejeitar checkout com carrinho vazio', async () => {
    const response = await request(app)
      .post('/api/checkout')
      .send({
        cart: [],
        method: 'PIX',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'O carrinho está vazio');
  });

  it('[CT-FUN-22] – Deve rejeitar checkout sem método de pagamento informado', async () => {
    const response = await request(app)
      .post('/api/checkout')
      .send({
        cart: [{ id: 1, name: 'Teclado', price: 200, qty: 1 }],
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
  });

  it('[CT-FUN-23] – Deve listar histórico de pedidos registrados', async () => {
    await Order.create({
      orderId: 'NX-100001',
      items: [{ id: 1, name: 'Monitor', qty: 1 }],
      method: 'CARTAO',
    });

    const response = await request(app).get('/api/orders');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].orderId).toBe('NX-100001');
  });

  it('[CT-FUN-24] – Deve retornar 404 ao buscar pedido por orderId inexistente', async () => {
    const response = await request(app).get('/api/orders/NX-9999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Pedido não encontrado');
  });
});
