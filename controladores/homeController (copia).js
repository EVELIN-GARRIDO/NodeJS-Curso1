module.exports.home = (request, response)=>{
    response.send("hola desde el controlador home");
}

module.exports.nosotros = (request, response) => {
    response.json({mensaje:"hola desde nosotros"});
}

module.exports.parametros = (request, response) => {
    //desestructuración
    const {id, slug} = request.params;

    response.send("id="+id+" | slug= "+slug);
}
module.exports.query_string = (request, response) => {
    //desestructuración
    const { id, slug } = request.query;

    response.send("id=" + id + " | slug= " + slug);
}