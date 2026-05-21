const Sequelize = require('sequelize')
const db        = require('../db/connection')

const User = db.define('user', {
    authId: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    role: {
        type: Sequelize.STRING
    }
})

//module.exports = User
module.exports = {
    getUserById: async id => User.findByPk(id),
    getUserByAuthId: async authId => User.findOne({authId}),
    addUser: async data => User.create(data)
}