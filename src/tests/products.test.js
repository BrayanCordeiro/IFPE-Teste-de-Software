const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const Product = require('../models/Product');

describe('Catálogo de Produtos (/api/products)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Product.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('[CT-FUN-07] – Deve criar um produto com dados válidos', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        name: 'Monitor Gamer 27',
        price: 1299.90,
        category: 'Eletrônicos',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Produto criado com sucesso');
    expect(response.body.product).toHaveProperty('id');
    expect(response.body.product.name).toBe('Monitor Gamer 27');
  });

  it('[CT-FUN-08] – Deve rejeitar criação de produto sem campos obrigatórios', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'Erro ao criar produto');
  });

  it('[CT-FUN-09] – Deve listar todos os produtos cadastrados', async () => {
    await Product.bulkCreate([
      { name: 'Teclado Mecânico', price: 350.00, category: 'Periféricos' },
      { name: 'Mouse Gamer', price: 199.90, category: 'Periféricos' },
    ]);

    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(2);
  });

  it('[CT-FUN-10] – Deve buscar um produto existente pelo ID', async () => {
    const created = await Product.create({
      name: 'Mouse Sem Fio',
      price: 150.00,
      category: 'Periféricos',
    });

    const response = await request(app).get(`/api/products/${created.id}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Mouse Sem Fio');
  });

  it('[CT-FUN-11] – Deve retornar 404 ao buscar produto com ID inexistente', async () => {
    const response = await request(app).get('/api/products/99999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Produto não encontrado');
  });

  it('[CT-FUN-12] – Deve atualizar os dados de um produto existente', async () => {
    const created = await Product.create({
      name: 'Headset',
      price: 200.00,
      category: 'Áudio',
    });

    const response = await request(app)
      .put(`/api/products/${created.id}`)
      .send({ price: 179.90 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(Number(response.body.product.price)).toBe(179.90);
  });

  it('[CT-FUN-13] – Deve excluir um produto existente e validar remoção', async () => {
    const created = await Product.create({
      name: 'Webcam HD',
      price: 250.00,
      category: 'Vídeo',
    });

    const deleteRes = await request(app).delete(`/api/products/${created.id}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);

    const getRes = await request(app).get(`/api/products/${created.id}`);
    expect(getRes.status).toBe(404);
  });
});
