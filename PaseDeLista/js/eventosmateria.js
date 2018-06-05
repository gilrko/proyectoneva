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
    var materias = function () {
        var cargarAsistencia;
        var cargarFaltas;
        var requestAlumnosAsistencia;
        function pasarVariables(pagina, nombres) {
            pagina += "?";
            nomVec = nombres.split(",");
            for (i = 0; i < nomVec.length; i++)
                pagina += nomVec[i] + "=" + escape(eval(nomVec[i])) + "&";
            pagina = pagina.substring(0, pagina.length - 1);
            var pag = pagina;
            return pag;
        }
        var asistencias = function (materia2, grupo2) {
            var UriAsistencia;
            var materia = materia2;
            var grupo = grupo2;

            function loadAsistencias() {
                UriAsistencia = "http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadasistenciasgrupo.php?usuario=";
                UriAsistencia += obtenerVariables('usuario');
                UriAsistencia += "&usuariovalida=";
                UriAsistencia += obtenerVariables('usuariovalida');
                UriAsistencia += "&periodoactual=";
                UriAsistencia += obtenerVariables('periodoactual');
                UriAsistencia += '&materia=';
                UriAsistencia += 'AEB1055';
                UriAsistencia += '&grupo=';
                UriAsistencia += '8A';
            }
            loadAsistencias()
            cargarAsistencia = $.ajax({
                method: "GET",
                url: UriAsistencia,
                crossDomain: true,
                datatype: "json"
            });
            cargarAsistencia.fail(function (jqError, textStatus) {
                alert("Ha ocurrido un error.");
            });
        }
        var faltas = function (materia2, grupo2) {
            var UriFaltas;
            var materia = materia2;
            var grupo = grupo2;

            function loadFaltas() {
                UriFaltas = "http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadfaltasgrupo.php?usuario=";
                UriFaltas += obtenerVariables('usuario');
                UriFaltas += "&usuariovalida=";
                UriFaltas += obtenerVariables('usuariovalida');
                UriFaltas += "&periodoactual=";
                UriFaltas += obtenerVariables('periodoactual');
                UriFaltas += '&materia=';
                UriFaltas += 'AEB1055';
                UriFaltas += '&grupo=';
                UriFaltas += '8A';
            }
            loadFaltas()
            cargarFaltas = $.ajax({
                method: "GET",
                url: UriFaltas,
                crossDomain: true,
                datatype: "json"
            });
            cargarFaltas.fail(function (jqError, textStatus) {
                alert("Ha ocurrido un error.");
            });
        }
        var Uri;
        var alumnosAsistencia = function () {
            requestAlumnosAsistencia = $.ajax({
                method: "GET",
                url: "localhost:8080/php/alumnoAsistencias.php",
                crossDomain: true,
                datatype: "json",
            });
            
        }
        function loadURL() {
            Uri = "http://itculiacan.edu.mx/dadm/apipaselista/data/obtienegrupos2.php?usuario=";
            Uri += obtenerVariables('usuario');
            Uri += "&usuariovalida=";
            Uri += obtenerVariables('usuariovalida');
            Uri += "&periodoactual=";
            Uri += obtenerVariables('periodoactual');
        }
        var usuario = obtenerVariables('usuario');
        var usuariovalida = obtenerVariables('usuariovalida');
        var periodoactual = obtenerVariables('periodoactual');
        var materia;
        var grupo;
        var parametros = "opcion=guardar" + "&id=" + 0;
        loadURL();
        var cargar = $.ajax({
            method: "GET",
            url: Uri,
            data: parametros,
            crossDomain: true,
            datatype: "json"
        });
        cargar.done(function (data) {
            var obj = jQuery.parseJSON(data);
            console.log(data, "<----funciona");
            if (obj.respuesta) {
                var body = document.getElementsByTagName("body")[0];
                var tabla = document.createElement("table");
                tabla.id = 'tblMaterias';
                var tblBody = document.createElement("tbody");
                $.each(obj.grupos, function (index, value) {
                    if (value.materia != undefined) {
                        asistencias(value.clavemateria, value.grupo);
                        faltas(value.clavemateria, value.grupo);
                        alumnosAsistencia();
                        var hilera = document.createElement("tr");
                        var celda = document.createElement("td");
                        var button = document.createElement("button");
                        var text = document.createElement("span");
                        var textAsistencias = document.createElement("span");
                        var textFaltas = document.createElement("span");
                        $("td").css("background-color", "yellow");
                        var textClaveMateria = document.createTextNode(value.clavemateria + " ")
                        text.appendChild(textClaveMateria);
                        cargarAsistencia.done(function (data) {
                            var obj = jQuery.parseJSON(data);
                            if (obj.respuesta) {
                                var textAsistenciasCont = document.createTextNode(obj.cantidad);
                                textAsistencias.appendChild(textAsistenciasCont);
                                requestAlumnosAsistencia.done(function (data2){
                                    console.log("LAAA VIDAAAA---->",data2)
                                })
                            } else {
                                var textAsistenciasCont = document.createTextNode(0);
                                textAsistencias.appendChild(textAsistenciasCont);
                            }
                        })
                        cargarFaltas.done(function (data) {
                            var obj = jQuery.parseJSON(data);
                            if (obj.respuesta) {
                                var textFaltasCont = document.createTextNode(obj.cantidad);
                                textFaltas.appendChild(textFaltasCont);
                            } else {
                                var textFaltasCont = document.createTextNode(0);
                                textFaltas.appendChild(textFaltasCont);
                            }
                        })
                        var textoCelda = document.createTextNode(value.materia);
                        button.appendChild(textoCelda);
                        button.className = 'btnMaterias';
                        button.onclick = function () {
                            materia = value.clavemateria;
                            grupo = value.grupo;
                            window.location = (pasarVariables('lista.html', 'usuario,usuariovalida,periodoactual,materia,grupo'));
                        }
                        celda.appendChild(button);
                        celda.appendChild(textClaveMateria);
                        celda.appendChild(textAsistencias);
                        celda.appendChild(textFaltas);
                        hilera.appendChild(celda);
                        tblBody.appendChild(hilera);
                    }
                });
                tabla.appendChild(tblBody);
                body.appendChild(tabla);
                tabla.setAttribute("border", "2");
            } else {
                alert(obj.respuesta);
            }
        })
        cargar.fail(function (jqError, textStatus) {
            alert("Ha ocurrido un error.");
        });
        return false;
    }
    $(document).ready(materias);
}
$(document).ready(iniciaApp);