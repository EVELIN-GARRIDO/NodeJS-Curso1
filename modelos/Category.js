const Sequelize = require('sequelize');

const db = require('../database/mysqldb');
const slug = require('slug');

const Category = db.define('categories', {
    id:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true
    },
    nombre:
    {
        type: Sequelize.STRING(100)
    },
    slug:
    {
        type: Sequelize.STRING(100)
    }
},{
    hooks:
    {
        beforeCreate(category)
        {
            category.slug = slug(category.nombre).toLowerCase();
        }
    }
});

module.exports = Category;