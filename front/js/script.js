//Span que indica la cantidad de elementos de la lista.
var cantidad = document.getElementById('cantidad');

//Como la interfaz de editar/subir se comparte, la misma tiene un comportamiento que se adecúa
//acorde a este booleano.
var modoEdicion = false;

//Este array se utilizará para guardar objetos que tienen:
	//1: un nombre de archivo de imagen = "nombre_de_archivo.jpg"
	//2: una descripción = max 200 caracteres.
	//3: una posición en la lista = 0, 1, 2... Se actualiza en el drag & drop.
//Se guardará en el localStorage para su persistencia en la ventana.
//Para una persistencia real, utilizaría una base de datos.
var elementos = [];

//Cada vez que se refresca la página, llena la <ul> existente de <li>, por cada elemento encontrado en la DB.
$(document).ready(function(){
		let elementosParseados = JSON.parse(localStorage.getItem('elementos'));
		if(!elementosParseados) return;
		elementosParseados.forEach(function(elemento, index){
			agregarElementoALaLista(elemento.imagen, elemento.descripcion, index);
		});
		cantidad.textContent = `Cantidad de elementos: ${elementos.length}`;
});

//Cuando el usuario envía el elemento, sube a la carpeta 'upload' la imagen,
//y guarda el nombre de la imagen con su extensión, y la descripción en la DB.
$(document).ready(function(){
	$("#but_upload").click(function(){
		let fd = new FormData();
		let files = $('#file')[0].files[0];
		fd.append('file', files);

		$.ajax({
			url: 'http://localhost:80/EjercicioTelecentro/back/upload.php',
			type: 'POST',
			data: fd,
			contentType: false,
			processData: false,
			success: function(response){
				if(response != 0){
					$("#img").attr("src", `back/${response}`);
					$(".preview img").show();
				}else{
					alert('El archivo es muy pesado o no es una imagen');
				}
			},
		});
	});
});

function agregarElemento(){
	var imagen, descripcion, index;

	if(modoEdicion){
			imagen = document.getElementById('file').files[0].name;
			descripcion = document.getElementById('vistaDescripcion').value;
			index = parseInt(document.querySelector('label').id);
			modificarElementoDeLaLista(imagen, descripcion, index);
	}else{
			imagen = document.getElementById('file').files[0].name;
			descripcion = document.getElementById('descripcion').value;
			index = elementos.length;
			agregarElementoALaLista(imagen, descripcion, index);
	}

	modoEdicion = false;
	cantidad.textContent = `Cantidad de elementos: ${elementos.length}`;
	limpiarInputs();
}

function modificarElementoDeLaLista(imagen, descripcion, index){
		elementos[index].imagen = imagen;
		elementos[index].descripcion = descripcion;
		document.getElementById(`img${index}`).src = `back/upload/${imagen}`;
		document.getElementById(`desc${index}`).textContent = descripcion;
		localStorage.setItem('elementos', JSON.stringify(elementos));
}

//Esto que hice está pésimo, es muy mala práctica y lo sé. Explico mi problema.
//Los <li>(elementos) tienen un evento que ocurre al reordenarse 'onmouseup="actualizarOrdenDeLista()"'.
//Esa función devuelve una colección de <li> del DOM.
//El problema es que este evento se dispara antes que el resultado del nuevo orden de elementos,
//realizado con la función '.sortable' de jQuery, y por lo tanto el orden que devuelve no muestra cambios.
//Estos cambios sí son efectuados, pero como ocurren luego del evento, necesito pasar por encima de su sincronía.
//Por eso el timeout.

function actualizarOrdenDeLista(){
	setTimeout(reordenarLista, 20);
}

//Cada <li> tiene un id que guarda su posición numérica en la lista.
//En esta función los reasigno con sus nuevos valores, y los guardo en el localStorage.
function reordenarLista(){
	let nuevoOrden = [];
	let lista = document.querySelectorAll('li');
	for(var i = 0; i < lista.length; i++){
		//jQuery crea un nodo temporal con esta clase mientras se hace un drag.
		//Sin embargo, prevalece hasta este momento, con esta condición lo skipeo.
		if(!lista[i].classList.contains('ui-sortable-placeholder')){
			nuevoOrden.push(elementos[lista[i].id]);
		}
	}
	localStorage.setItem('elementos', JSON.stringify(nuevoOrden));
}

//Lo elimino de la lista <ul> y del array que maneja al localStorage.
function eliminarElemento(id){
	let elemento = document.getElementById(id);
	elemento.parentNode.removeChild(elemento);
	encontrarElementoPorIndexYEliminarlo(id);
	localStorage.setItem('elementos', elementos);
	cantidad.textContent = `Cantidad de elementos: ${elementos.length}`;
}

function encontrarElementoPorIndexYEliminarlo(index){
	for(let i = 0; i < elementos.length; i++){
		if(elementos[i].index == index){
			elementos.splice(i, 1);
			return;
		}
	}
}

function editarElemento(id){
		modoEdicion = true;
		let img = document.getElementById('img');
		let descripcion = document.getElementById('vistaDescripcion');
		descripcion.value = elementos[id].descripcion;
		document.querySelector('label').id = id;
		img.src = `back/upload/${elementos[id].imagen}`;
}

//El elemento se añadirá a la <ul>, con una imagen pequeña como previsualización y una descripción recortada.
function agregarElementoALaLista(imagen, descripcion, index){
	if(!imagen){return alert("Debe elegir una imagen jpg/jpeg/png/gif")}
	if(!descripcion){return alert("El elemento debe tener una descripción")}

	let element = `<li id="${index}" class="elemento" onmouseup="actualizarOrdenDeLista()">
						<div class="row">
							<div class="col col-lg-2">
								<img id="img${index}" class="bulletImg" src="back/upload/${imagen}"/>
							</div>
							<div class="col col-lg-5">
									<h3 id="desc${index}">${descripcion.substring(0, 7)}</h3>
							</div>
							<div class="col col-lg-5">
								<i class="far fa-edit" onclick="editarElemento(${index})"></i>
								<i class="fa fa-trash" onclick="eliminarElemento(${index})" aria-hidden="true"></i>
							</div>
						</div>
					</li>`;

	$('#lista').append(element);
	elementos.push({imagen, descripcion, index});
	localStorage.setItem('elementos', JSON.stringify(elementos));
}

//Lo que dice! =D
function limpiarInputs(){
		document.getElementById('descripcion').value = '';
		document.getElementById('vistaDescripcion').value = '';
		document.getElementById('file').value = '';
		document.getElementById('img').src = 'https://via.placeholder.com/300';
}

//Esta función de jQuery permite hacer un drag and drop de los elementos en la lista.
$(function(){
	$("#lista").sortable();
	$("#lista").disableSelection();
});
