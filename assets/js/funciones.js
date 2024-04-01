function soloNumeros(evt) {
  key = (document.all) ? evt.keyCode : evt.which;
  //alert(key);
  if (key == 17) return false;
  /* digitos,del, sup,tab,arrows*/
  return ((key >= 48 && key <= 57) || key == 8 || key == 127 || key == 9 || key == 0);
}
function confirmaAlert(pregunta, ruta) {
  jCustomConfirm(pregunta, 'Tienda', 'Aceptar', 'Cancelar', function (r) {
    if (r) {
      window.location = ruta;
    }
  });
}

function alertAlert(mensaje) {
  jAlert(mensaje);
}
function validaCorreo(valor) {
  if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)) {
    return true;
  } else {
    return false;
  }
}
function salir(ruta) {
  jCustomConfirm('¿Realmente desea cerrar sesión?', 'Tienda', 'Aceptar', 'Cancelar', function (r) {
    if (r) {
      window.location = ruta;
    }
  });
}