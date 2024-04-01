var mongoose = require('mongoose');
const slugs = require('slug');

const { Schema } = mongoose; 

var ProductoEsquema = new Schema(
    {
        categoria_id:{
            type: Schema.Types.ObjectId,
            ref: "Categoria",
            required: true
        },
        nombre: {
            type: String,
            unique: true,
            required: true
        },
        slug: String,
        descripcion: {
            type: String,
            required: true
        },
        precio:{
            type: Number,
            require: true
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
);
ProductoEsquema.pre('save', function (next) {
    const slug = slugs(this.nombre);
    this.slug = `${slug}`;
    next();
});
module.exports = mongoose.model('Producto', ProductoEsquema);