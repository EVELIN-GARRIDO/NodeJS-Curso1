module.exports.home = (request, response)=>{
    let nombre = "César Cancino";
    const paises =[
        {
            nombre:"Chile",
            nic:"cl"
        },
        {
            nombre: "Perú",
            nic: "pe"
        },
        {
            nombre: "Bolivia",
            nic: "bo"
        },
        {
            nombre: "Argentina",
            nic: "ar"
        },
        {
            nombre: "Venezuela",
            nic: "ve"
        }
    ];
    return response.render("home/home", { tituloPagina: "Inicio", nombre: nombre, paises: paises });
}