const request = require('supertest');
const { sequelize } = require('../config/db');
const app = require('../app');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

describe('Autenticação de usuário (/api/login)', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash('Senha123', salt);

    await User.create({
      name: 'usuarioauth',
      email: 'usuarioauth@email.com',
      password: passHash,
    });
  });

  afterEach(async () => {
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('[CT-FUN-04] – Deve rejeitar autenticação com e-mail não cadastrado', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'inexistente@email.com',
        password: 'Senha123',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Credenciais inválidas');
  });

  it('[CT-FUN-05] – Deve autenticar usuário com login e senha válida', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'usuarioauth@email.com',
        password: 'Senha123',
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login realizado');
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.name).toBe('usuarioauth');
    expect(response.body.user.email).toBe('usuarioauth@email.com');
    expect(response.body.user).not.toHaveProperty('password');
  });

  it('[CT-FUN-06] – Deve rejeitar autenticação com senha inválida', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'usuarioauth@email.com',
        password: 'wrong-pass-123',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Credenciais inválidas');
  });
});
