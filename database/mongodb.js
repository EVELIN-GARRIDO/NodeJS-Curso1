const mongoose = require('mongoose');

mongoose.connect( process.env.URI_LOCAL ).then(()=>{
    
}).catch((er)=>{
    console.log("falló la conexión " + er);
});