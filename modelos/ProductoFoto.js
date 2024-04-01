var mongoose = require('mongoose');
const { Schema } = mongoose; 

var ProductoFotoEsquema = new Schema(
    {
        producto_id:
        {
            type: Schema.Types.ObjectId,
            ref: "Producto"
        },
        nombre: {
            type: String,
            required: true
        } 
    },
    {
        timestamps: false,
        versionKey: false
    }
);

module.exports = mongoose.model('ProductoFoto', ProductoFotoEsquema);