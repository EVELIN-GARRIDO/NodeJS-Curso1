const Sequelize = require('sequelize');

const db = require('../database/mysqldb');
const slug = require('slug');

const Category = require('./Category');

const Product = db.define('products', {
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
    slug:
    {
        type: Sequelize.STRING(100)
    },
    precio:
    {
        type: Sequelize.INTEGER(11)
    },
    descripcion:
    {
        type: Sequelize.TEXT('long')
    }
}, {
    hooks:
    {
        beforeCreate(product) {
            product.slug = slug(product.nombre).toLowerCase();
        }
    }
});
//agregar las llaves foráneas
Product.belongsTo(Category, { foreignKey : 'category_id'});

module.exports = Product;