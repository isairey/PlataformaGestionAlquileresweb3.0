const Sequelize = require('sequelize');
const db = require('../db/connection');

const Event = db.define('event', {
    user_id: {
        type: Sequelize.INTEGER,
    },
    date: {
        type: Sequelize.DATE,
    },
    address: {
        type: Sequelize.STRING,
    },
    client: {
        type: Sequelize.STRING,
    }
});

module.exports = Event;