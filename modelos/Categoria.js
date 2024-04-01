const mongoose = require('mongoose');

const {Schema} = mongoose;
const slugs  = require('slug');

var CategoriaEsquema = new Schema(
    {
        nombre:  
        {
            type: String,
            unique: true,
            trim: true
        },
        slug: {  
            type: String
        }
    },
    {
        timestamps: false,
        versionKey: false
    }
);
CategoriaEsquema.pre('save', function(next){
    const slug = slugs(this.nombre);
    this.slug = `${slug}`;
    next();
});

module.exports = mongoose.model('Categoria', CategoriaEsquema);