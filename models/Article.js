const Sequelize = require('sequelize');
const db = require('../db/connection');

const Article = db.define('article', {
    user_id: {
        type: Sequelize.INTEGER,
    },
    name: {
        type: Sequelize.STRING,
    },
    acquisition: {
        type: Sequelize.DATE,
    },
    paid: {
        type: Sequelize.DOUBLE,
    },
    description: {
        type: Sequelize.STRING,
    }

});

module.exports = Article;