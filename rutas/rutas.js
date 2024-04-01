const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const homeController = require('../controladores/homeController');
const formulariosController = require('../controladores/formulariosController');
const reportesController = require('../controladores/reportesController');
const utilesController = require('../controladores/utilesController');
const mongoController = require('../controladores/mongoController');
const webpayController = require('../controladores/webpayController');
const mysqlController = require('../controladores/mysqlController');
const accesoController = require('../controladores/accesoController');
const verificarUsuario = require('../middlewares/verificarUsuario');


router.get("/", homeController.home);
router.get("/formularios", formulariosController.home);
router.get("/formularios/normal", formulariosController.normal);
router.post("/formularios/normal", [
    body("nombre", "Ingrese un nombre válido")
    .trim()
    .notEmpty()
    .escape(),
    body("correo", "Ingrese un E-Mail válido")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("telefono", "Ingrese un teléfono válido")
        .trim()
        .notEmpty()
        .escape()
] ,formulariosController.normal_post);
router.get("/formularios/upload", formulariosController.upload);
router.post("/formularios/upload", formulariosController.upload_post);


router.get("/reportes", reportesController.home);
router.get("/reportes/pdf", reportesController.pdf);
router.get("/reportes/excel", reportesController.excel);
router.get("/reportes/csv", reportesController.csv);

router.get("/utiles", utilesController.home);
router.get("/utiles/mail", utilesController.mail);
router.get("/utiles/jwt", utilesController.jwt);
router.get("/utiles/qr", utilesController.qr);
router.get("/utiles/cliente-rest", utilesController.cliente_rest);


//mongo
router.get("/mongo", mongoController.home);
router.get("/mongo/categorias", mongoController.categorias);
router.get("/mongo/categorias/add", mongoController.categorias_add);
router.post("/mongo/categorias/add", 
[
    body("nombre", "Ingrese un nombre válido").trim().notEmpty().escape()
], mongoController.categorias_add_post);
router.get("/mongo/categorias/edit/:id", mongoController.categorias_edit);
router.post("/mongo/categorias/edit/:id", [
    body("nombre", "Ingrese un nombre válido").trim().notEmpty().escape()
], mongoController.categorias_edit_post);
router.get("/mongo/categorias/delete/:id", mongoController.categorias_delete);
router.get("/mongo/productos", mongoController.productos);
router.get("/mongo/productos/add", mongoController.productos_add);
router.post("/mongo/productos/add", [
    body("nombre", "El nombre es obligatorio").trim().notEmpty().escape(),
    body("precio", "El precio es obligatorio").isNumeric().notEmpty(),
    body("descripcion", "La descripción es obligatoria").trim().notEmpty().escape(),
], mongoController.productos_add_post);
router.get("/mongo/productos/edit/:id", mongoController.productos_edit);
router.post("/mongo/productos/edit/:id", [
    body("nombre", "El nombre es obligatorio").trim().notEmpty().escape(),
    body("precio", "El precio es obligatorio").isNumeric().notEmpty(),
    body("descripcion", "La descripción es obligatoria").trim().notEmpty().escape(),
], mongoController.productos_edit_post);
router.get("/mongo/productos/delete/:id", mongoController.productos_delete);
router.get("/mongo/productos/categorias/:id", mongoController.productos_categorias);
router.get("/mongo/productos/fotos/:id", mongoController.productos_fotos);
router.post("/mongo/productos/fotos/:id", mongoController.productos_fotos_post);
router.get("/mongo/productos/fotos/delete/:producto_id/:foto_id", mongoController.productos_fotos_delete);


//mysql
router.get("/mysql", mysqlController.home);
router.get("/mysql/categorias", mysqlController.categorias);
router.get("/mysql/categorias/add", mysqlController.categorias_add);
router.post("/mysql/categorias/add", [
    body("nombre", "Ingrese un nombre válido").trim().notEmpty().escape()
], mysqlController.categorias_add_post);
router.get("/mysql/categorias/edit/:id", mysqlController.categorias_edit);
router.post("/mysql/categorias/edit/:id", [
    body("nombre", "Ingrese un nombre válido").trim().notEmpty().escape()
], mysqlController.categorias_edit_post);
router.get("/mysql/categorias/delete/:id", mysqlController.categorias_delete);
router.get("/mysql/productos", mysqlController.productos);
router.get("/mysql/productos/categorias/:id", mysqlController.productos_categorias);
router.get("/mysql/productos/add", mysqlController.productos_add);
router.post("/mysql/productos/add", [
    body("nombre", "El nombre es obligatorio").trim().notEmpty().escape(),
    body("precio", "El precio es obligatorio").isNumeric().notEmpty(),
    body("descripcion", "La descripción es obligatoria").trim().notEmpty().escape(),
], mysqlController.productos_add_post);
router.get("/mysql/productos/edit/:id", mysqlController.productos_edit);
router.post("/mysql/productos/edit/:id", [
    body("nombre", "El nombre es obligatorio").trim().notEmpty().escape(),
    body("precio", "El precio es obligatorio").isNumeric().notEmpty(),
    body("descripcion", "La descripción es obligatoria").trim().notEmpty().escape(),
], mysqlController.productos_edit_post);
router.get("/mysql/productos/delete/:id", mysqlController.productos_delete);
router.get("/mysql/productos/fotos/:id", mysqlController.productos_fotos);
router.post("/mysql/productos/fotos/:id", mysqlController.productos_fotos_post);
router.get("/mysql/productos/fotos/delete/:producto_id/:foto_id", mysqlController.productos_fotos_delete);

//webpay
router.get("/webpay", webpayController.home);
router.get("/webpay/pagar", webpayController.webpay_pagar);
router.get("/webpay/respuesta", webpayController.webpay_respuesta);

//rutas de acceso
router.get("/acceso/login", accesoController.login);
router.post("/acceso/login", [
    body("correo", "Ingrese un E-Mail válido")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "La contraseña con 6 o más caracteres")
        .trim()
        .isLength({ min: 6 })
        .escape()
],accesoController.login_post);
router.get("/acceso/protegida", [verificarUsuario],accesoController.protegida);
router.get("/acceso/protegida2", [verificarUsuario], accesoController.protegida2);
router.get("/acceso/salir", [verificarUsuario], accesoController.salir);
router.get("/acceso/registro", accesoController.registro);
router.post("/acceso/registro", [
    body("nombre", "El campo nombre es obligatorio").trim().notEmpty().escape(),
    body("correo", "El campo E-Mail es obligatorio y debe tener un formato válido")
        .trim()
        .isEmail()
        .normalizeEmail(),
    body("password", "Contraseña con 6 o más carácteres")
        .trim()
        .isLength({ min: 6 })
        .escape()
        .custom((value, { req }) => {
            if (value !== req.body.password2) {
                throw new Error("Las contraseñas ingresadas no coinciden");
            } else {
                return value;
            }
        }),
], accesoController.registro_post);


module.exports = router; 