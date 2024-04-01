module.exports.home = (request, response)=>{
     
    return response.render("reportes/home", { tituloPagina: "Reportes"});
}

const pdf = require("html-pdf"); 
const fs = require("fs");
exports.pdf = (request, response) => {

    const ubicacionPlantilla = require.resolve(process.cwd()+"/vistas/reportes/pdf.html");

    let contenidoHtml = fs.readFileSync(ubicacionPlantilla, 'utf-8');

    let valor = "soy un valor pasado desde el controlador";
    let ruta = process.cwd();

    contenidoHtml = contenidoHtml.replace("{{valor}}", valor);
    contenidoHtml = contenidoHtml.replace("{{ruta}}", ruta);

    pdf.create(contenidoHtml).toStream( (error, stream)=>{
        if(error)
        {
            response.end("Error creando el PDF: "+error);
        }else
        {
            response.setHeader("Content-Type", "application/pdf");
            stream.pipe(response);
        }
    } );

}
var path = require('path');
const xls = require('excel4node');
exports.excel = (request, response) => 
{
    //libro de trabajo
    var libro = new xls.Workbook();

    //hoja de trabajo
    var hoja = libro.addWorksheet("Hoja 1");
    //estilo normal
    var style = libro.createStyle({
        font: {
            color: '#040404',
            size: 12
        }
    });
    //estilo verde
    var greenS = libro.createStyle({
        font: {
            color: '#388813',
            size: 12
        }
    });

    //primera fila
    hoja.cell(1, 1).string("ID").style(style);
    hoja.cell(1, 2).string("Nombre").style(style);
    hoja.cell(1, 3).string("Precio").style(style);

    /*
    hoja.cell(2, 1).string("1").style(style);
    hoja.cell(2, 2).string("Televisor ñandú").style(style);
    hoja.cell(2, 3).string("2000").style(style);
    */
    const productos = [
        {
            id: 1,
            nombre: 'Producto con ñandú',
            precio: 9000
        },
        {
            id: 2,
            nombre: 'Mouse óptico',
            precio: 1200
        },
        {
            id: 3,
            nombre: 'Leche descremada',
            precio: 913
        },
    ];
    var i = 2;
    for (let producto of productos)
    {
        hoja.cell(i, 1).number(producto.id).style(style);
        hoja.cell(i, 2).string(producto.nombre).style(style);
        hoja.cell(i, 3).number(producto.precio).style(style);
        i++;
    }
    

    var timestamp = Math.floor(Date.now() / 1000);

    const pathExcel = path.join(process.cwd() + "/assets/", 'excel', `reporte_${timestamp}.xlsx`);

    libro.write(pathExcel, function (err, stats) {
        if (err) {
            console.log(err);
        } else {
            response.download(pathExcel);
            return false;
        }
    });

}

const { Parser } = require('json2csv');

exports.csv = (request, response) => 
{
    const productos = [
        {
            id: 1,
            nombre: 'Producto con ñandú',
            precio: 9000
        },
        {
            id: 2,
            nombre: 'Mouse óptico',
            precio: 1200
        },
        {
            id: 3,
            nombre: 'Leche descremada',
            precio: 913
        },
    ];
    const datos = Object.keys(productos[0]);

    const csv = new Parser({ datos: datos });
    var timestamp = Math.floor(Date.now() / 1000);
    var nombre = `reporte_${timestamp}.csv`;

    fs.writeFile(process.cwd() + "/assets/csv/" + nombre, csv.parse(productos), function (err) {
        if (err) {
            console.log(err);
            throw err;
        }
        response.download(process.cwd() + "/assets/csv/" + nombre);
    });

}