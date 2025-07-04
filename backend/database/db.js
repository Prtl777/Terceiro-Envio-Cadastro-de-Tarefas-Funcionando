const { Sequelize } = require('sequelize');

// Cria conexão com banco SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './tarefas.db'  // Caminho do arquivo do banco de dados
});

// Teste de conexão
sequelize.authenticate()
    .then(() => console.log('Conectado ao banco SQLite'))
    .catch(err => console.error('Erro ao conectar ao banco:', err));

module.exports = sequelize;
