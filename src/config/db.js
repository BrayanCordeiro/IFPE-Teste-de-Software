require('dotenv').config({ quiet: true });
const { Sequelize } = require('sequelize');

const isTestEnv = process.env.NODE_ENV === 'test';
const hasPostgresUrl = Boolean(process.env.DATABASE_URL);

let sequelize;

if (isTestEnv) {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });
} else if (hasPostgresUrl) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false,
  });
}

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(
      hasPostgresUrl && !isTestEnv
        ? 'PostgreSQL Conectado via Sequelize!'
        : 'SQLite Conectado via Sequelize!'
    );
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
};

module.exports = { sequelize, connectDB };
