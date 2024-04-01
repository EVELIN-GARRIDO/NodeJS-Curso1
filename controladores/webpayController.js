var Client = require('node-rest-client').Client;
let webpay_peticion;
let webpay_respuesta;

exports.home = (request, response) => {

    return response.render("webpay/home", { tituloPagina: "Webpay" });
}

exports.webpay_pagar = (request, response) => {

    var cliente = new Client();
    var args = {
        data: {
            "buy_order": "ordenCompra12345678",
            "session_id": "sesion1234557545",
            "amount": 10000,
            "return_url": "http://192.168.21.1:3000/webpay/respuesta"
        },
        headers: { "Content-Type": "application/json", "Tbk-Api-Key-Id": process.env.WEBPAY_ID, "Tbk-Api-Key-Secret": process.env.WEBPAY_SECRET }
    };
    cliente.post(process.env.WEBPAY_URL, args, function(data, response){
        webpay_peticion = data;
    });

    return response.render("webpay/webpay_pagar", { tituloPagina: "Webpay", webpay_peticion: webpay_peticion });
}
exports.webpay_respuesta = (request, response) => {

    var cliente2 = new Client();
    const { token_ws } = request.query;
    var args = {
        data: {},
        headers: { "Content-Type": "application/json", "Tbk-Api-Key-Id": process.env.WEBPAY_ID, "Tbk-Api-Key-Secret": process.env.WEBPAY_SECRET }
    };
    cliente2.put(process.env.WEBPAY_URL + "/" + token_ws, args, function (data, response) { 
        webpay_respuesta = data;
       
    }); 
    return response.render("webpay/webpay_respuesta", { tituloPagina: "Webpay", webpay_respuesta: webpay_respuesta, token_ws: token_ws });
}