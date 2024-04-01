const express = require('express');
const app = express();

app.get("/", (request, response)=>{
    response.send("Hola mundo con las manos en el código desde express");
});
app.get("/otra", (request, response) => {
    response.send("otra ruta");
});
app.listen(5000, ()=>{
    console.log('trabajando desde express');
});