const Sequelize = require('sequelize');
const db = require('../db/connection');
const Event = require('../models/Event');
const Article = require('../models/Article');

const Contract = db.define('contract', {
    user_id: {
        type: Sequelize.INTEGER,
    },
    event_id: {
        type: Sequelize.INTEGER,
    },
    article_id: {
        type: Sequelize.INTEGER,
    },
    value: {
        type: Sequelize.DOUBLE,
    }
})
Contract.belongsTo(Event, {foreignKey: 'event_id'})
Contract.belongsTo(Article, {foreignKey: 'article_id'})
module.exports = Contract