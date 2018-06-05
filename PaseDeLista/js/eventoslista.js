var iniciaApp = function () {
    function obtenerVariables(name) {
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var tmpURL = window.location.href;
        var results = regex.exec(tmpURL);
        if (results == null)
            return "";
        else
            return results[1];
    }
    var Uri;
    function loadURL() {
        Uri = "http://itculiacan.edu.mx/dadm/apipaselista/data/obtienealumnos2.php?usuario=";
        Uri += obtenerVariables('usuario');
        Uri += "&usuariovalida=";
        Uri += obtenerVariables('usuariovalida');
        Uri += "&periodoactual=";
        Uri += obtenerVariables('periodoactual');
        Uri += "&materia=";
        Uri += obtenerVariables('materia');
        Uri += "&grupo=";
        Uri += obtenerVariables('grupo');

    }

    //Asistencia
    var Urilista;
    function loadURIlista(ncontrol, incidencia) {
        Urilista = "http://itculiacan.edu.mx/dadm/apipaselista/data/asignaincidencia.php?usuario=";
        Urilista += obtenerVariables('usuario');
        Urilista += "&usuariovalida=";
        Urilista += obtenerVariables('usuariovalida');
        Urilista += "&periodoactual=";
        Urilista += obtenerVariables('periodoactual');
        Urilista += "&materia=";
        Urilista += obtenerVariables('materia');
        Urilista += "&grupo=";
        Urilista += obtenerVariables('grupo');
        Urilista += "&ncontrol=";
        Urilista += ncontrol;
        Urilista += "&incidencia=";
        Urilista += incidencia;
        return Urilista
    }

    /*const ipc = require('electron').ipcRenderer
    const botonPDF = document.getElementById('btnPDF')
    botonPDF.addEventListener('click',function(event){
        botonPDF.style.display = "none"
        
    })*/
    var ncontrolasistencia = [];
    var ncontrolfaltas = [];
    var TomaAsistencia = function () {
        var r = confirm("Terminar pase de lista?");
        if (r == true) {
            $.each(ncontrolasistencia, function (index, value) {
                var pase = $.ajax({
                    method: "GET",
                    url: loadURIlista(value, 1),
                    crossDomain: true,
                    datatype: "json"
                });
            });
            $.each(ncontrolfaltas, function (index, value) {
                var pase = $.ajax({
                    method: "GET",
                    url: loadURIlista(value, 2),
                    crossDomain: true,
                    datatype: "json"
                });
            });
            //Se agregó la impresion al momento de finalizar el pase de lista
            ipc.send('print-to-pdf');
            history.back();
        }
        else {
            alert('Siga con su trabajo');
        }
    }
    $("#btnFinalizar").on("click", TomaAsistencia);

    var materias = function () {
        var usuario;
        var usuariovalida;
        var periodoactual;
        var parametros = "opcion=guardar" + "&id=" + 0;
        loadURL();

        var cargar = $.ajax({
            method: "GET",
            url: Uri,
            crossDomain: true,
            datatype: "json"
        });
        cargar.done(function (data) {
            var obj = jQuery.parseJSON(data);
            if (obj.respuesta) {
                var body = document.getElementsByTagName("body")[0];
                var tabla = document.createElement("table");
                tabla.id = 'tblLista';
                var tblBody = document.createElement("tbody");

                $.each(obj.alumnos, function (index, value) {
                    if (value.nombre != undefined) {
                        ncontrolasistencia.push(value.ncontrol);
                        var hilera = document.createElement("tr");
                        var celda = document.createElement("td");
                        var button = document.createElement("button");
                        var nombrecompleto = (value.apellidopaterno != null) ? value.apellidopaterno + " " : " ";
                        nombrecompleto += (value.apellidomaterno != null) ? value.apellidomaterno + " " : " ";
                        nombrecompleto += value.nombre;
                        var textoCelda = document.createTextNode(nombrecompleto);
                        button.appendChild(textoCelda);
                        button.id = 'btnLista';
                        button.onclick = function () {

                            var r = confirm("Alumno Falto?");
                            if (r == true) {
                                ncontrolfaltas.push(value.ncontrol);
                                ncontrolasistencia.slice(ncontrolasistencia.indexOf(value.ncontrol), 1);
                                event.preventDefault();
                                $(this).closest('tr').remove();
                                alert('Falta');
                            }
                            else {
                                alert('Asistencia');
                            }
                        }
                        celda.appendChild(button);
                        hilera.appendChild(celda);
                        tblBody.appendChild(hilera);
                    }
                });
                tabla.appendChild(tblBody);
                body.appendChild(tabla);
                tabla.setAttribute("border", "2");
            } else {
                history.back();
                alert('Esta materia no tiene alumnos asignados');
            }
        })
        cargar.fail(function (jqError, textStatus) {
            alert("Ha ocurrido un error :(");
        });
        return false;
    }
    $(document).ready(materias);
}
$(document).ready(iniciaApp);        