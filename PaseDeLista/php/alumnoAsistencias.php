<?php
include 'conexion.php';
function listado(){
	$respuesta=false;
	$con=conecta();
	$consulta=sprintf("select * from SELECT * FROM reportealumnos order by identificador");
	$resConsulta = mysql_query($con,$consulta);
	if(mysqli_num_rows($resConsulta)>0){
		$respuesta = true;
	}
	$salidaJSON = array('respuesta' => $respuesta,"result" => $resConsulta);
	print json_encode($salidaJSON);
}

listado()
?>