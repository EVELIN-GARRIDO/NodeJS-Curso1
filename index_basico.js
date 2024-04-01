const http = require('http');

const server = http.createServer( (request, response)=>{
    response.end("hola mundo con las manos en el código");
} );

server.listen(5000, ()=>{
    console.log("servidor corriendo desnudo!!");
});