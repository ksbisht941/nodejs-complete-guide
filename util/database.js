const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_complete', 'root', 'root@123', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
