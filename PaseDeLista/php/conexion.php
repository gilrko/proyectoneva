
<?php
function conecta()
{    //servidor,usuario,contraseña, base de datos
	 $con=mysqli_connect("127.0.0.1","root","","paselista");
	 return $con;
}
?>
