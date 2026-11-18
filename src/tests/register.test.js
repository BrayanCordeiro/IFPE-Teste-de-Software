const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../config/db');
const User = require('../models/User');

describe('Entidade usuário e suas respectivas chamadas',() => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });
  afterEach(async () => {
    await User.destroy({ where: {} });
  });
  afterAll(async () => {
    await sequelize.close();
  });

  it('[CT-FUN-01] – Deve cadastrar um usuário com dados válidos', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        name: 'usuario',
        email: 'usuario@email.com',
        password: 'Senha123'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Usuário cadastrado com sucesso');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.name).toBe('usuario');
    expect(response.body.user.email).toBe('usuario@email.com');
    expect(response.body.user).not.toHaveProperty('password');
    expect(response.body.user).not.toHaveProperty('hashedPassword');
  });

  it('[CT-FUN-02] – Deve rejeitar o cadastro de usuário com dados inválidos', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        name: null,
        email: null,
        password: null
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Todos os campos são obrigatórios');
  });
});