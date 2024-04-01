const Sequelize = require('sequelize');
const db = require('../database/mysqldb');
const bcrypt = require('bcryptjs');

const User = db.define('users', {
    id:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:
    {
        type: Sequelize.STRING(100)

    },
    correo:
    {
        type: Sequelize.STRING(100)

    },
    password:
    {
        type: Sequelize.STRING(100)

    }
}, {
    hooks:
    {
        async beforeCreate(user)
        {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        }
    }
}
);


module.exports = User;