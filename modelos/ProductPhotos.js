const Sequelize = require('sequelize');

const db = require('../database/mysqldb');

const Product = require('./Product');

const ProductPhotos = db.define('products_photos', {
    id:
    {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre:
    {
        type: Sequelize.STRING(100)

    }
});
//agregar llaves foráneas
ProductPhotos.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = ProductPhotos;