require('dotenv').config();
const { Sequelize } = require('sequelize');

const isTestEnv = process.env.NODE_ENV === 'test';

const sequelize = isTestEnv
  ? new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })
  : new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
    });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(isTestEnv ? 'SQLite (Test) Conectado!' : 'PostgreSQL Conectado via Sequelize!');
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
};

module.exports = { sequelize, connectDB };
