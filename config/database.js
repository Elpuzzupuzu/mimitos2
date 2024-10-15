const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mimitos2', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
