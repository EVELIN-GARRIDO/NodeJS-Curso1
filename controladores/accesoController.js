const { validationResult } = require('express-validator');
const User = require('../modelos/User');
const bcrypt = require("bcryptjs");

exports.login = (request, response) => 
{
    if (request.isAuthenticated())
    {
        response.redirect("/acceso/protegida");
    }
    return response.render("acceso/login", {tituloPagina: "Login"});
}
exports.login_post = async (request, response) => 
{
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/acceso/login");
    }
    const {correo, password} = request.body;
    try {
        let user = await User.findOne(
            {
                where:
                {
                    correo: correo
                },
                raw: true
            });
        if(!user)
        {
            throw new Error('Los datos ingresados no son correctos');
        }
        bcrypt.compare(password, user.password, (err, data)=>{
            if (err)
            {
                throw err;
            }
            if(data)
            {
                request.login(user, function(err){
                    if(err)
                    {
                        throw new Error("Error al crear la sesión");
                    }
                    return response.redirect("/acceso/protegida");
                });
            }else
            {
                request.flash("css", 'danger');
                request.flash('mensajes', [{ msg: "Los datos ingresados no son correctos" }]);
                return response.redirect('/acceso/login');
            }
            
        });
    } catch (error) {
        request.flash("css", 'danger');
        request.flash('mensajes', [{ msg: error.message }]);
        return response.redirect('/acceso/login');
    }
}
exports.protegida = (request, response) => 
{
    return response.render("acceso/protegida", { tituloPagina: "Login" });
}
exports.protegida2= (request, response) => {
    return response.render("acceso/protegida2", { tituloPagina: "Login" });
}
exports.salir = async (request, response) => 
{
    request.logout(function (err){
        if (err) { return next(err); }
        request.flash("css", 'success');
        request.flash("mensajes", [{ msg: 'Has cerrado la sesión exitosamente' }]);
        return response.redirect("/acceso/login");
    });
}
exports.registro =  (request, response) => {
    if (request.isAuthenticated()) {
        response.redirect("/acceso/protegida");
    }
    return response.render("acceso/registro", {tituloPagina: 'Registro'});
}

exports.registro_post = async (request, response) => 
{
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/acceso/registro");
    }
    const { nombre, correo, password, password2 } = request.body;
    try {
        let user = await  User.findOne(
            {
                where:
                {
                    'correo': correo
                },
                raw:true
            });
        if(user)
        {
            throw new Error('El E-Mail ingresado ya está siendo usado por otro usuario. ');
        }   
        let guardar = await User.create(
            {
                nombre: nombre,
                correo: correo,
                password: password
            });
        if(!guardar)
        {
            request.flash("css", 'danger');
            request.flash("mensajes", [{ msg: 'Se produjo un error inesperado, por favor vuelva a intentarlo.' }]); 
        }else
        {
            request.flash("css", 'success');
            request.flash("mensajes", [{ msg: 'Te has registrado exitosamente.  ' }]);
            
        }
        response.redirect('/acceso/registro');
    } catch (error) {
        request.flash("css", 'danger');
        request.flash("mensajes", errors.array());
        return response.redirect("/acceso/registro");
    }
}