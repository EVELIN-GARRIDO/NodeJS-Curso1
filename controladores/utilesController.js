exports.home = (request, response)=>{
     
    return response.render("utiles/home", { tituloPagina: "Útiles"});
}
const nodemailer = require('nodemailer');
exports.mail = async (request, response) => {

    const transport = nodemailer.createTransport(
        {
            host: process.env.SMTP_SERVER,
            port: process.env.SMTP_PORT,
            auth:{
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    await transport.sendMail(
        {
            from: '"Ejemplo node" <' + process.env.SMTP_USER + '>',
            to: "info@tamila.cl",
            subject: "E-Mail de prueba UDEMY",
            html: `<h1>Hola título del correo</h1><p>párrafo de envío</p>`
        });
    request.flash("css", "success");
    request.flash("mensajes", [{msg:"Se ha enviado el mail exitosamente"}]);
    return response.redirect("/utiles");
}
const jwt = require('jwt-simple');
const moment = require('moment');
exports.jwt = (request, response) => {

    let payload={
        sub: 1,
        nombre: "César Cancino",
        correo: "info@tamila.cl",
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix()
    };
    let token = jwt.encode(payload, process.env.SECRETO);
    let traducido = jwt.decode(token, process.env.SECRETO);
    response.json({ token: token, traducido: traducido });
}
const codigo_qr = require('qrcode');
exports.qr = (request, response) => 
{
    let url ="https://www.tamila.cl";
    
    codigo_qr.toDataURL(url, (err, src) => {
        if (err) res.send("Error occured");

        return response.render("utiles/qr", { tituloPagina: "Crear QR", src: src, url: url });

    });
    
}
var Client = require('node-rest-client').Client;
let datos;
exports.cliente_rest = (request, response) => 
{
    let cliente = new Client();

    cliente.get("http://localhost/clientes/tamila/clientes/pruebas/v1/productos", function(data, response){
        datos = data;
    });
    //console.log(datos);
    return response.render("utiles/cliente_rest", { tituloPagina: "Cliente rest", datos: datos });
}