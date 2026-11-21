const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const Offer = require('../models/Offer');

describe('Catálogo de Ofertas (/api/offers)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Offer.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('[CT-FUN-14] – Deve criar uma oferta promocional válida', async () => {
    const response = await request(app)
      .post('/api/offers')
      .send({
        name: 'SSD NVMe 1TB',
        price: 399.90,
        originalPrice: 550.00,
        discount: '-27%',
        category: 'Hardware',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.offer).toHaveProperty('id');
  });

  it('[CT-FUN-15] – Deve rejeitar criação de oferta sem preço original obrigatório', async () => {
    const response = await request(app)
      .post('/api/offers')
      .send({
        name: 'SSD NVMe 1TB',
        price: 399.90,
        category: 'Hardware',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Erro ao criar oferta');
  });

  it('[CT-FUN-16] – Deve listar todas as ofertas cadastradas', async () => {
    await Offer.create({
      name: 'Placa de Vídeo',
      price: 2100.00,
      originalPrice: 2500.00,
      discount: '-16%',
      category: 'Hardware',
    });

    const response = await request(app).get('/api/offers');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  it('[CT-FUN-17] – Deve retornar 404 ao buscar oferta com ID inexistente', async () => {
    const response = await request(app).get('/api/offers/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Oferta não encontrada');
  });

  it('[CT-FUN-18] – Deve atualizar o desconto de uma oferta existente', async () => {
    const created = await Offer.create({
      name: 'Memória RAM 16GB',
      price: 270.00,
      originalPrice: 300.00,
      discount: '-10%',
      category: 'Hardware',
    });

    const response = await request(app)
      .put(`/api/offers/${created.id}`)
      .send({ discount: '-25%' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.offer.discount).toBe('-25%');
  });

  it('[CT-FUN-19] – Deve remover uma oferta existente', async () => {
    const created = await Offer.create({
      name: 'Gabinete Gamer',
      price: 320.00,
      originalPrice: 400.00,
      discount: '-20%',
      category: 'Hardware',
    });

    const response = await request(app).delete(`/api/offers/${created.id}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Oferta removida com sucesso');
  });
});
