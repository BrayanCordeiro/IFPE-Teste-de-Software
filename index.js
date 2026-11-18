require('dotenv').config();
const { connectDB, sequelize } = require('./src/config/db');
const app = require('./src/app');

connectDB();

const PORT = process.env.PORT || 3000;

// Sincroniza os models com o banco de dados ANTES de abrir a porta do servidor
// O { alter: true } atualiza a tabela se você adicionar novas colunas depois
sequelize.sync({ alter: true }).then(() => {
  console.log('Tabelas do banco de dados sincronizadas com sucesso!');
  
  app.listen(PORT, () => {
    console.log(`Nexus API is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Erro ao sincronizar tabelas:', error);
});