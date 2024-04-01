const { validationResult } = require('express-validator');
const Categoria = require('../modelos/Categoria');
const Producto = require('../modelos/Producto');
const ProductoFoto = require('../modelos/ProductoFoto');
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");

exports.home = (request, response) => {

    return response.render("mongo/home", { tituloPagina : "MongoDB"});
}
exports.categorias = async (request, response) => {

    try {
        //let datos = await Categoria.find().lean(); 
        let datos = await Categoria.find().lean().sort({_id:-1}); 
        return response.render("mongo/categorias", { tituloPagina: "MongoDB", datos: datos });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/");
    }
    
}
exports.categorias_add = (request, response) => 
{
    return response.render("mongo/categorias_add", { tituloPagina: "MongoDB" });
}
exports.categorias_add_post = async (request, response) => 
{
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mongo/categorias/add");
    }
    const {nombre} = request.body;
    try {
        //select * from categoria where nombre=$nombre;
        let categoria = await Categoria.findOne({nombre : nombre});
        if(categoria)
        {
            throw new Error('Ya existe esta categoría');
        }
        save = new Categoria(
            {
                nombre: nombre
            }
        );
        await save.save();
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se ha creado el registro exitosamente' }]);
        response.redirect('/mongo/categorias/add');
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect('/mongo/categorias/add');
    }

}
exports.categorias_edit = async (request, response) => {

    const {id} =request.params;
    try {
        let categoria = await Categoria.findById(id).lean();
        if (!categoria) {
            throw new Error('Error desconocido. Contactar al Web Master');
        }
        return response.render("mongo/categorias_edit", { tituloPagina: "MongoDB", categoria: categoria });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect('/mongo/categorias');
    }
    
}
exports.categorias_edit_post =async (request, response) => {

    const { id } = request.params; 
    const { nombre } = request.body;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mongo/categorias/edit/"+id);
    }
    try {

        let categoria = await Categoria.findById(id);
        if (!categoria) {
            throw new Error('Error desconocido. Contactar al Web Master');
        }
        await categoria.updateOne({nombre: nombre});
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se modificó el registro exitosamente' }]);
        response.redirect(`/mongo/categorias/edit/${categoria._id}`);
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/categorias`);
    }

    
}
exports.categorias_delete = async (request, response) => 
{
    const { id } = request.params;
    try {
        let categoria = await Categoria.findById(id);
        if (!categoria) {
            throw new Error('Error desconocido. Contactar al Web Master');
        }
        await categoria.remove();
        request.flash("css", 'success');
        request.flash('mensajes', [{ msg: "Se eliminó el registro exitosamente" }]);
        return response.redirect(`/mongo/categorias`);
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/categorias`);
    }
}
//########################PRODUCTOS
exports.productos = async (request, response) => {

    try {  
        //let datos = await Producto.find().lean().sort({ _id: -1 });
        /*
        let datos = await Producto.aggregate(
            [
                {
                    $lookup:{
                        from: "categorias",
                        localField: "categoria_id",
                        foreignField: "_id",
                        as: "categoria"
                    }
                },
                {
                    $unwind: "$categoria"
                }
            ]
        ).sort({ _id: -1 });
        */
        let datos = await Producto.find().populate('categoria_id').lean().sort({ _id: -1 });


        return response.render("mongo/productos", { tituloPagina: "MongoDB", datos: datos });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/");
    }

}
exports.productos_add = async (request, response) => {
    let categorias = await Categoria.find().lean(); 
    return response.render("mongo/productos_add", { tituloPagina: "MongoDB", categorias: categorias }); 
}
exports.productos_add_post = async (request, response) => 
{
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mongo/categorias/edit/" + id);
    }
    const { nombre, descripcion, precio, categoria_id } = request.body;
    try {
        let producto = await Producto.findOne({nombre:nombre});
        if(producto)
        {
            throw new Error('Error desconocido');
        }
        save = new Producto(
            {
                categoria_id: categoria_id,
                nombre: nombre,
                precio: precio,
                descripcion: descripcion
            }
        );
        await save.save();
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se ha creado el registro exitosamente' }]);
        response.redirect('/mongo/productos/add');
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mongo/productos/add");
    }
}
exports.productos_edit = async (request, response) => {

    const { id } = request.params;
    try {
        let producto = await Producto.findById(id).populate('categoria_id').lean();
         
        if (!producto) {
            throw new Error('Error desconocido');
        }
        let categorias = await Categoria.find().lean(); 
        return response.render("mongo/productos_edit", { tituloPagina: "MongoDB", producto: producto, categorias: categorias }); 
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mongo/productos");
    }

}

exports.productos_edit_post = async (request, response) => {
    const { id } = request.params;
    const { nombre, precio, descripcion, categoria_id } = request.body;

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mongo/productos/edit/" + id);
    }
    try {

        let producto = await Producto.findById(id);
        if (!producto) {
            throw new Error('Error desconocido. Contactar al Web Master');
        }
        await producto.updateOne({ categoria_id: categoria_id, nombre: nombre, precio: precio, descripcion: descripcion });

        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se modificó el registro exitosamente' }]);
        response.redirect(`/mongo/productos/edit/${producto._id}`);
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/categorias`);
    }

 }
exports.productos_delete = async (request, response) => {
    const { id } = request.params;
    try {
        let producto = await Producto.findById(id);
        if (!producto) {
            throw new Error('Error desconocido. Contactar al Web Master');
        }
        await producto.remove();
        request.flash("css", 'success');
        request.flash('mensajes', [{ msg: "Se eliminó el registro exitosamente" }]);
        return response.redirect(`/mongo/productos`);
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/productos`);
    }
}
exports.productos_categorias = async (request, response) => {

    const { id } = request.params;
    try {
        let cat = await Categoria.findById(id).lean();
        if(!cat)
        {
            throw new Error('Error desconocido');
        }
        let datos = await Producto.find({categoria_id:id}).populate('categoria_id').lean().sort({ _id: -1 });
        return response.render("mongo/productos_categorias", { tituloPagina: "MongoDB", datos: datos, cat: cat });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/productos`);
    }

    
}
exports.productos_fotos = async (request, response) => {
    const { id } = request.params;
    try {
        let producto = await Producto.findById(id).lean();
        if (!producto) {
            throw new Error('Error desconocido. Contactar al Web Master');
        }
        let fotos = await ProductoFoto.find({producto_id: id}).sort({ _id: -1 }).lean();

        return response.render("mongo/productos_fotos", {tituloPagina:"MongoDB", producto: producto, fotos: fotos });
   

    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/productos`);
    }
}
exports.productos_fotos_post = async (request, response) => {
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024;//5 MB

    try {
        const { id } = request.params;
        const producto = await Producto.findById(id).lean();
        if (!producto)
        {
            throw new Error('No existe el producto');
        }
        form.parse(request, async (err, fields, files) => {
            try {
                if (err) {
                    throw new Error('Se produjo un error: ' + err);
                }
                const file = files.foto;
                if (file.originalFilename === "") {
                    throw new Error("No se subió ninguna imagen");
                }
                const imageTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                ];
                if (!imageTypes.includes(file.mimetype)) {
                    throw new Error("Por favor agrega una imagen JPG|PNG|GIF");
                }
                var unix = Math.round(+new Date() / 1000);

                switch (file.mimetype) {
                    case "image/jpeg":
                        nombre_final = unix + ".jpg";
                        break;
                    case "image/png":
                        nombre_final = unix + ".png";
                        break;
                    case "image/gif":
                        nombre_final = unix + ".gif";
                        break;
                }
                if (file.size > 50 * 1024 * 1024) {
                    throw new Error("Máximo 5MB");
                }

                const dirFile = path.join(
                    __dirname,
                    `../assets/uploads/producto/${nombre_final}`
                ); 


                fs.copyFile(file.filepath, dirFile, function (err) {
                    if (err) throw err;

                });



                save = new ProductoFoto(
                    {
                        producto_id: id,
                        nombre: `${nombre_final}`
                    }
                );

                await save.save();
                request.flash("css", "success");
                request.flash("mensajes", [{ msg: "se guardó la foto exitosamente" }]);
                return response.redirect(`/mongo/productos/fotos/${id}`);

            } catch (error) {
                request.flash("css", "danger");
                request.flash("mensajes", [{ msg: error.message }]);
                return response.redirect(`/mongodb/productos/fotos/${id}`);
            }

        });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/productos/fotos/${id}`);
    }
}
exports.productos_fotos_delete = async (request, response) => {

    const { producto_id, foto_id } = request.params;
    try {
        const producto = await Producto.findById(producto_id).lean();
        if (!producto) {
            throw new Error('Error desconocido');
        }
        let foto = await ProductoFoto.findById(foto_id);
        if(!foto)
        {
            throw new Error('Error desconocido');
        }
        fs.unlinkSync(`./assets/uploads/producto/${foto.nombre}`);
        await foto.remove();
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se eliminó el registro exitosamente' }]);
        response.redirect(`/mongo/productos/fotos/${producto_id}`);

    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mongo/productos/fotos/${producto_id}`);
    }
}