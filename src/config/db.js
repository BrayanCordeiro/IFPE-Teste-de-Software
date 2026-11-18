const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, 
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Conectado via Sequelize!');
  } catch (error) {
    console.error('Erro ao conectar ao banco:', error);
  }
};

module.exports = { sequelize, connectDB };