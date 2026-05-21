const Sequelize = require('sequelize');
const {credentials} = require('../config')

const sequelize = new Sequelize(credentials.mysql.dataBase, credentials.mysql.userDataBase, credentials.mysql.password, {
    host: credentials.mysql.host,
    dialect: 'mysql',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
});

module.exports = sequelize;