const {validationResult} = require('express-validator');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

module.exports.home = (request, response)=>{
    
    return response.render("formularios/home", { tituloPagina: "Formularios"  });
}
module.exports.normal = (request, response) => {

    return response.render("formularios/normal", { tituloPagina: "Formularios simple" });
}
module.exports.normal_post = (request, response) => {

    const errors = validationResult(request);
    if(!errors.isEmpty())
    {
        request.flash("css", "danger");
        request.flash("mensajes", errors.array());
        return response.redirect("/formularios/normal");
    }

    const {nombre, correo, telefono} = request.body;//form-data

    response.send("nombre=" + nombre + " | correo=" + correo + " | teléfono=" + telefono);
}
module.exports.upload = (request, response) => {

    return response.render("formularios/upload", { tituloPagina: "Formularios upload" });
}
module.exports.upload_post = (request, response) => {

    const form = new formidable.IncomingForm();
    form.maxFileSize = 100 * 1024 * 1024;//10 MB
    form.parse(request, async (err, fields, files)=>{

        try {
            if (err) {
                throw new Error('Se produjo un error: ' + err);
            }
            const file = files.foto;
            if (file.originalFilename === "") {
                throw new Error("No se subió ninguna imagen");
            }
            const imageTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
            ];
            if (!imageTypes.includes(file.mimetype)) {
                
                throw new Error("Por favor agrega una imagen JPG|PNG|GIF");
            }
            if (file.size > 100 * 1024 * 1024) {
               
                throw new Error("Máximo 10MB");
            }
            var unix = Math.round(+new Date() / 1000);
            switch (file.mimetype) {
                case "image/jpeg":
                    nombre_final = unix + ".jpg";
                    break;
                case "image/png":
                    nombre_final = unix + ".png";
                    break;
                case "image/gif":
                    nombre_final = unix + ".gif";
                    break;
            }

            const dirFile = path.join(__dirname, `../assets/uploads/udemy/${nombre_final}`);

            fs.copyFile(file.filepath, dirFile, function (err) {
                if (err) throw err;

            });
            request.flash("css", "success");
            request.flash("mensajes", [{ msg: "se guardó la foto exitosamente" }]);
            return response.redirect("/formularios/upload");
            
        } catch (error) {
            request.flash("css", "danger");
            request.flash("mensajes", [{ msg: error.message }]);
            return response.redirect(`/formularios/upload`);
        }

    } );
}