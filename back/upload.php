<?php
	//Obtengo el nombre del archivo junto a su extensión ('filename.jpg')
	$filename = $_FILES['file']['name'];

	//Establezco la ruta donde va a ser guardado. Será en la carpeta upload, previamente creada.
	$location = "upload/".$filename;
	$uploadOk = 1;
	$imageFileType = pathinfo($location, PATHINFO_EXTENSION);

	//Establezco los tipos de extensiones válidas.
	$valid_extensions = array("jpg","jpeg","png", "gif");

	//Reviso que pertenezca a una de esas extensiones.
	if(!in_array(strtolower($imageFileType), $valid_extensions)){
	   $uploadOk = 0;
	}

	//Si todo está bien, el archivo se guardará en la ruta previamente asignada.
	//Responde 0 si no se pudo lograr.
	//Responde la ruta junto al archivo de haberlo logrado. Ej: 'upload/unarchivo.gif'.
	if($uploadOk == 0){
	   echo 0;
	}else{
	   if(move_uploaded_file($_FILES['file']['tmp_name'],$location)){
		  echo $location;
	   }else{
		  echo 0;
	   }
	}

?>
