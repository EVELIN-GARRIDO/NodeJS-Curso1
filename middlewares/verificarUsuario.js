module.exports = (request, response, next)=>
{
    if (request.isAuthenticated())
    {
        return next();
    }
    request.flash("css", 'danger');
    request.flash('mensajes', [{ msg: "Debes estar logueado para poder acceder a este contenido" }]);
    response.redirect("/acceso/login");
};