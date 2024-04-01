const { validationResult } = require('express-validator');
const Category = require('../modelos/Category');
const Product = require('../modelos/Product');
const ProductPhotos = require('../modelos/ProductPhotos');
const slug = require('slug');
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
exports.home = (request, response) => {

    return response.render("mysql/home", { tituloPagina: "MySQL" });
}
exports.categorias = async (request, response) => {
    try {
        let datos = await Category.findAll(
            {
                order:[ ['id', 'desc'] ],
                raw:true
            }
            );
        return response.render("mysql/categorias", { tituloPagina: "MySQL", datos: datos });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mysql");
    }
    
}
exports.categorias_add = async (request, response) => 
{
    return response.render("mysql/categorias_add", { tituloPagina: "MySQL"  });
}
exports.categorias_add_post = async (request, response) => 
{
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mysql/categorias/add");
    }
    const {nombre } = request.body;
    try {
        let categoria = await Category.findOne({
            raw:true,
            where:
            {
                'nombre': nombre
            }
        });
        if (categoria) {
            throw new Error('Error desconocido');
        }
        let guardar = await Category.create({'nombre': nombre});
        if(!guardar)
        {
            request.flash("css", 'danger');
            request.flash("mensajes", [{ msg: 'Ocurrió un error inesperado, por favor vuelva a intentarlo' }]);
        }else
        {
            request.flash("css", 'success');
            request.flash("mensajes", [{ msg: 'Se ha creado el registro exitosamente' }]);
        }
        response.redirect('/mysql/categorias/add');
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mysql/categorias/add");
    }
}
exports.categorias_edit = async (request, response) => {
    const { id } = request.params;
    try {
        let categoria = await Category.findOne({
            raw: true,
            where:
            {
                'id': id
            }
        });
        if (!categoria) {
            throw new Error('Error desconocido');
        }
        return response.render("mysql/categorias_edit", { tituloPagina:"MySQL",  categoria: categoria });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mysql/categorias");
    }
}
exports.categorias_edit_post = async (request, response) => {
    //desesctructuración
    const { id } = request.params;
    const { nombre } = request.body;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mysql/categorias/edit/"+id);
    }
    try {
        let categoria = await Category.findOne({
            raw: true,
            where:
            {
                'id': id
            }
        });
        if (!categoria) {
            throw new Error('Error desconocido');
        }
        await Category.update({ 'nombre': nombre, slug: slug(nombre).toLowerCase() }, {where:{id: id}});
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se ha modificado el registro exitosamente' }]);
        response.redirect(`/mysql/categorias/edit/${id}`);
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect(`/mysql/categorias/edit/${id}`);
    }
}
exports.categorias_delete = async (request, response) => 
{
    const { id } = request.params;
    try {
        let categoria = await Category.findOne({
            raw: true,
            where:
            {
                'id': id
            }
        });
        if (!categoria) {
            throw new Error('Error desconocido');
        }
        await Category.destroy({
            where:{
                'id':id
            }
        });
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se eliminó el registro exitosamente' }]);
        response.redirect("/mysql/categorias");
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect(`/mysql/categorias`);
    }
}
//##################PRODUCTOS
exports.productos = async (request, response) => 
{
    try {
        let datos = await Product.findAll(
            {
                raw:true,
                order: [ ['id', 'desc']],
                include: {all: true, nested: true}
            });
        //console.log(datos);
        return response.render("mysql/productos", { tituloPagina: "MySQL", datos: datos });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mysql");
    }
}
exports.productos_categorias = async (request, response) => {
    const { id } = request.params;
    try {
        let cat = await Category.findOne(
            {
                where:
                {
                    'id': id
                },
                raw:true
            });
        if (!cat)
         {
            throw new Error('Error desconocido');
         }
        let datos = await Product.findAll(
            {
                raw: true,
                order: [['id', 'desc']],
                include: { all: true, nested: true },
                where:
                {
                    'category_id':id
                }
            });
        //console.log(datos);
        return response.render("mysql/productos_categorias", { tituloPagina: "MySQL", datos: datos, cat: cat });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect("/mysql");
    }
}
exports.productos_add = async (request, response) => 
{
    let categorias = await Category.findAll({
        raw:true
    });
    return response.render("mysql/productos_add", { tituloPagina: "MySQL", categorias: categorias });
}
exports.productos_add_post = async (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mysql/categorias/add");
    }
    const { nombre, descripcion, precio, categoria_id } = request.body;
    try {
        let guardar = await Product.create(
            {
                category_id: categoria_id,
                nombre: nombre,
                descripcion: descripcion,
                precio: precio
            });
        if(!guardar)
        {
            request.flash("css", 'danger');
            request.flash("mensajes", [{ msg: 'Ocurrió un error inesperado, por favor vuelva a intentarlo' }]);
        }else
        {
            request.flash("css", 'success');
            request.flash("mensajes", [{ msg: 'Se ha creado el registro exitosamente' }]);
        }
        response.redirect('/mysql/productos/add');
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect('/mysql/productos/add');
    }
}
exports.productos_edit = async (request, response) => 
{
    const { id } = request.params;
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) 
        {
            throw new Error('Error desconocido');
        }

        let categorias = await Category.findAll(
            {
                raw: true
            });
        return response.render("mysql/productos_edit", { tituloPagina: "MySQL", categorias: categorias, producto: producto });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error.message }]);
        response.redirect("/mysql/productos");
    }
}

exports.productos_edit_post = async (request, response) => 
{
    //desesctructuración
    const { id } = request.params;
    const { nombre, descripcion, precio, categoria_id } = request.body;
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/mysql/categorias/edit/"+id);
    }
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            throw new Error('Error desconocido');
        }
        await Product.update(
            {
                nombre: nombre,
                slug: slug(nombre).toLowerCase(),
                precio: precio,
                descripcion: descripcion,
                category_id: categoria_id
            },{
                where: { id: id }
            });
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se ha modificado el registro exitosamente' }]);
        response.redirect(`/mysql/productos/edit/${id}`);
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error.message }]);
        response.redirect(`/mysql/productos/edit/${id}`);
    }

}
exports.productos_delete = async (request, response) => {
    const { id } = request.params;
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            throw new Error('Error desconocido');
        }
        await Product.destroy(
            {
                where: {
                    'id': id
                }
            });
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se eliminó el registro exitosamente' }]);
        response.redirect("/mysql/productos");

    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error.message }]);
        response.redirect(`/mysql/productos`);
    }
}
exports.productos_fotos = async (request, response) => {
    const { id } = request.params;
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            throw new Error('Error desconocido');
        }
        let fotos = await ProductPhotos.findAll(
            {
                raw: true,
                order: [
                    ['id', 'desc']
                ],
                where:
                {
                    'product_id':id
                } 
            });
        return response.render("mysql/productos_fotos", { tituloPagina: "MySQL", fotos: fotos, producto: producto });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error.message }]);
        response.redirect(`/mysql/productos`); 
    }
}
exports.productos_fotos_post = async (request, response) => 
{
    const { id } = request.params;
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024;//5 MB
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            throw new Error('Error desconocido');
        }
        form.parse(request, async (err, fields, files)=>{
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
                let resultado = await ProductPhotos.create(
                    {
                        product_id: id,
                        nombre: nombre_final
                    });
                if(!resultado)
                {
                    request.flash("css", "danger");
                    request.flash("mensajes", [{ msg: "Se produjo un error inesperado, por favor vuelva a intentarlo" }]);
                }else
                {
                    request.flash("css", "success");
                    request.flash("mensajes", [{ msg: "se guardó la foto exitosamente" }]);
                }
                return response.redirect(`/mysql/productos/fotos/${id}`);
            } catch (error) {
                request.flash("css", "danger");
                request.flash("mensajes", [{ msg: error.message }]);
                return response.redirect(`/mysql/productos/fotos/${id}`);
            }
        });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect(`/mysql/productos/fotos/${id}`);
    }
}
exports.productos_fotos_delete = async (request, response) => {
    const { producto_id, foto_id } = request.params;
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': producto_id
            },
            raw: true,
        });
        if (!producto) {
            throw new Error('Error desconocido');
        }
        let foto = await ProductPhotos.findOne({
            where:
            {
                'id': foto_id
            },
            raw: true,
        });
        if(!foto) 
        {
            throw new Error('Error desconocido');
        }
        fs.unlinkSync(`./assets/uploads/producto/${foto.nombre}`);
        await ProductPhotos.destroy(
            {
                where: {
                    'id': foto_id
                }
            });
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Se eliminó el registro exitosamente' }]);
        response.redirect(`/mysql/productos/fotos/${producto_id}`);   
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", [{ msg: error }]);
        response.redirect(`/mysql/productos/fotos/${producto_id}`);
    }
}