module.exports = {

    calculadora: (n1, n2) =>
    {
        let resultado = parseInt(n1) + parseInt(n2);
        return `El resultado de ${n1} + ${n2} es ${resultado}`;
        //return "El resultado de "+n1+" + "+n2+" es igual a "+resultado;
    },
    acortarDescripcion: (valor)=>{
        return valor.substring(0, 150)
    },
    formatearNumero: (numero)=>
    {
        return new Intl.NumberFormat().format(numero);
    } 

}