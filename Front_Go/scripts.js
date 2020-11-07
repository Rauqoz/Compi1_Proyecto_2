'use stric';

// TAB

var tabActiva = null;

function openTab(evt, tab) {
	// Declare all variables
	var i, tabcontent, tablinks;

	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName('tabcontent');
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = 'none';
	}

	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName('tablinks');
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(' active', '');
	}

	// Show the current tab, and add an "active" class to the button that opened the tab
	tabActiva = tab;
	//   document.querySelector("#" + tab).innerHTML = `<h3>${tab}</h3>`;
	document.getElementById(tab).style.display = 'block';
	evt.currentTarget.className += ' active';
}

//funciones
document.getElementById('tabOpen').addEventListener('change', readFileAsString);

function readFileAsString() {
	var files = this.files;
	if (tabActiva == null || files.length === 0) {
		alert('Selecciona una Pestaña');
	} else {
		switch (tabActiva) {
			case 'p1':
				var reader = new FileReader();
				reader.onload = function(event) {
					// console.log('File content:', event.target.result);
					window.code1.getDoc().setValue(event.target.result);
				};
				reader.readAsText(files[0]);
				break;
			case 'p2':
				var reader = new FileReader();
				reader.onload = function(event) {
					// console.log('File content:', event.target.result);
					window.code2.getDoc().setValue(event.target.result);
				};
				reader.readAsText(files[0]);
				break;
			case 'p3':
				var reader = new FileReader();
				reader.onload = function(event) {
					// console.log('File content:', event.target.result);
					window.code3.getDoc().setValue(event.target.result);
				};
				reader.readAsText(files[0]);
				break;
			case 'p4':
				var reader = new FileReader();
				reader.onload = function(event) {
					// console.log('File content:', event.target.result);
					window.code4.getDoc().setValue(event.target.result);
				};
				reader.readAsText(files[0]);
				break;
			default:
				alert('Escoge Primero un Tab');
				break;
		}
	}
	// console.log(files);
	files.clear;
}

function tabGuardar() {
	console.log('Tab Guardar');
	var hoy = new Date();
	var dd = hoy.getDate();
	var mm = hoy.getMonth() + 1;
	var yyyy = hoy.getFullYear();
	var HH = hoy.getHours();
	var MM = hoy.getMinutes();
	var formato = '_' + dd + '_' + mm + '_' + yyyy + '_' + HH + '_' + MM;

	var nombre = 'Archivo' + formato + '.java'; //nombre del archivo
	var file = new Blob([ contenido ], { type: 'text/plain' });
	var contenido = '';

	switch (tabActiva) {
		case 'p1':
			//texto actual
			contenido = window.code1.getDoc().getValue();
			//formato para guardar el archivo

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(file, nombre);
			} else {
				let a = document.createElement('a'),
					url = URL.createObjectURL(file);
				a.href = url;
				a.download = nombre;
				document.body.appendChild(a);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			}
			break;
		case 'p2':
			//texto actual
			contenido = window.code2.getDoc().getValue();
			//formato para guardar el archivo

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(file, nombre);
			} else {
				let a = document.createElement('a'),
					url = URL.createObjectURL(file);
				a.href = url;
				a.download = nombre;
				document.body.appendChild(a);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			}
			break;
		case 'p3':
			//texto actual
			contenido = window.code3.getDoc().getValue();
			//formato para guardar el archivo

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(file, nombre);
			} else {
				let a = document.createElement('a'),
					url = URL.createObjectURL(file);
				a.href = url;
				a.download = nombre;
				document.body.appendChild(a);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			}
			break;
		case 'p4':
			//texto actual
			contenido = window.code1.getDoc().getValue();
			//formato para guardar el archivo

			if (window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(file, nombre);
			} else {
				let a = document.createElement('a'),
					url = URL.createObjectURL(file);
				a.href = url;
				a.download = nombre;
				document.body.appendChild(a);
				a.click();
				setTimeout(function() {
					document.body.removeChild(a);
					window.URL.revokeObjectURL(url);
				}, 0);
			}
			break;
		default:
			alert('Escoge Primero un Tab');
			break;
	}
}

function tabAmbos() {
	switch (tabActiva) {
		case 'p1':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code1.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		case 'p2':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code2.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		case 'p3':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code3.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		case 'p4':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code4.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		default:
			alert('Escoge Primero un Tab');
			break;
	}
}

function paginaTokensB(data) {
	let hoy = new Date();
	let dd = hoy.getDate();
	let mm = hoy.getMonth() + 1;
	let yyyy = hoy.getFullYear();
	let HH = hoy.getHours();
	let MM = hoy.getMinutes();
	let formato = '_' + dd + '_' + mm + '_' + yyyy + '_' + HH + '_' + MM;
	let cont = 1;

	let contenido = '';
	contenido += `<html>
					<head>
					</head>
					<body style='background-color:#34495E'>
					`;
	contenido += `<h1 align=center><font color ='white'> Lista de Tokens </h1>
					<br>
					<table border=11 , align='center', bordercolor='orange'>
					<tr align=center> <th><font color ='white'> Numero </th> <th><font color ='white'> Palabra </th> <th><font color ='white'> Tipo </th> <th><font color ='white'> Fila </th> <th><font color ='white'> Columna </th></tr>
					`;

	data.lB.forEach((element) => {
		contenido +=
			" <tr align=center> <td><font color ='white'> " +
			cont +
			" </td> <td><font color ='white'> " +
			element.palabra +
			" </td> <td><font color ='white'> " +
			element.tipo +
			" </td> <td><font color ='white'> " +
			element.fila +
			" </td> <td><font color ='white'> " +
			element.columna +
			' </td> </tr>';
		cont++;
	});

	contenido += `</table>
					<body>
					</html>`;

	let nombre = 'Tokens' + formato + '.html'; //nombre del archivo
	let file = new Blob([ contenido ], { type: 'text/plain' });

	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, nombre);
	} else {
		let a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = nombre;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function paginaTokensM(data) {
	let hoy = new Date();
	let dd = hoy.getDate();
	let mm = hoy.getMonth() + 1;
	let yyyy = hoy.getFullYear();
	let HH = hoy.getHours();
	let MM = hoy.getMinutes();
	let formato = '_' + dd + '_' + mm + '_' + yyyy + '_' + HH + '_' + MM;
	let cont = 1;

	let contenido = '';
	contenido += `<html>
					<head>
					</head>
					<body style='background-color:#34495E'>
					`;
	contenido += `<h1 align=center><font color ='white'> Lista de Errores Tokens </h1>
					<br>
					<table border=11 , align='center', bordercolor='orange'>
					<tr align=center> <th><font color ='white'> Numero </th> <th><font color ='white'> Fila </th> <th><font color ='white'> Columna </th> <th><font color ='white'> Palabra </th></tr>
					`;

	data.lM.forEach((element) => {
		contenido +=
			" <tr align=center> <td><font color ='white'> " +
			cont +
			" </td> <td><font color ='white'> " +
			element.fila +
			" </td> <td><font color ='white'> " +
			element.columna +
			" </td> <td><font color ='white'> " +
			element.palabra +
			' </td> </tr>';
		cont++;
	});

	contenido += `</table>
					<body>
					</html>`;

	let nombre = 'Errores Tokens' + formato + '.html'; //nombre del archivo
	let file = new Blob([ contenido ], { type: 'text/plain' });

	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, nombre);
	} else {
		let a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = nombre;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function paginaSintacticosM(data) {
	let hoy = new Date();
	let dd = hoy.getDate();
	let mm = hoy.getMonth() + 1;
	let yyyy = hoy.getFullYear();
	let HH = hoy.getHours();
	let MM = hoy.getMinutes();
	let formato = '_' + dd + '_' + mm + '_' + yyyy + '_' + HH + '_' + MM;
	let cont = 1;

	let contenido = '';
	contenido += `<html>
					<head>
					</head>
					<body style='background-color:#34495E'>
					`;
	contenido += `<h1 align=center><font color ='white'> Lista de Errores Sintacticos </h1>
					<br>
					<table border=11 , align='center', bordercolor='orange'>
					<tr align=center> <th><font color ='white'> Numero </th> <th><font color ='white'> Palabra </th> <th><font color ='white'> Error </th> <th><font color ='white'> Fila </th> <th><font color ='white'> Columna </th></tr>
					`;

	data.sM.forEach((element) => {
		contenido +=
			" <tr align=center> <td><font color ='white'> " +
			cont +
			" </td> <td><font color ='white'> " +
			element.palabra +
			" </td> <td><font color ='white'> " +
			element.esperado +
			" </td> <td><font color ='white'> " +
			element.fila +
			" </td> <td><font color ='white'> " +
			element.columna +
			' </td> </tr>';
		cont++;
	});

	contenido += `</table>
					<body>
					</html>`;

	let nombre = 'Errores Sintacticos' + formato + '.html'; //nombre del archivo
	let file = new Blob([ contenido ], { type: 'text/plain' });

	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, nombre);
	} else {
		let a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = nombre;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function paginaTraduccionJs(data) {
	let hoy = new Date();
	let dd = hoy.getDate();
	let mm = hoy.getMonth() + 1;
	let yyyy = hoy.getFullYear();
	let HH = hoy.getHours();
	let MM = hoy.getMinutes();
	let formato = '_' + dd + '_' + mm + '_' + yyyy + '_' + HH + '_' + MM;

	let contenido = data.trad;

	let nombre = 'TraduccionJs' + formato + '.js'; //nombre del archivo
	let file = new Blob([ contenido ], { type: 'text/plain' });

	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, nombre);
	} else {
		let a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = nombre;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function paginaDot(data) {
	let texto = '';
	texto +=
		`
	<!DOCTYPE html>
	<meta charset="utf-8">
	<body>
	<script src="https://d3js.org/d3.v5.js"></script>
	<script src="https://unpkg.com/viz.js@1.8.1/viz.js" type="application/javascript"></script>
	<script src="https://unpkg.com/d3-graphviz@2.1.0/build/d3-graphviz.js"></script>
	<div id="graph" style="text-align: center;"></div>
	<script>
	d3.select("#graph").graphviz(false).renderDot(\`digraph  {` +
		data.dot +
		`}\`);
	</script>`;

	let hoy = new Date();
	let dd = hoy.getDate();
	let mm = hoy.getMonth() + 1;
	let yyyy = hoy.getFullYear();
	let HH = hoy.getHours();
	let MM = hoy.getMinutes();
	let formato = '_' + dd + '_' + mm + '_' + yyyy + '_' + HH + '_' + MM;

	let contenido = texto;

	let nombre = 'dot' + formato + '.html'; //nombre del archivo
	let file = new Blob([ contenido ], { type: 'text/plain' });

	if (window.navigator.msSaveOrOpenBlob) {
		window.navigator.msSaveOrOpenBlob(file, nombre);
	} else {
		let a = document.createElement('a'),
			url = URL.createObjectURL(file);
		a.href = url;
		a.download = nombre;
		document.body.appendChild(a);
		a.click();
		setTimeout(function() {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		}, 0);
	}
}

function tabJs() {
	console.log('Tab Js');
	switch (tabActiva) {
		case 'p1':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code1.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		case 'p2':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code2.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		case 'p3':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code3.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		case 'p4':
			//post Js
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');

			var raw = JSON.stringify({ pTexto: window.code4.getDoc().getValue() });

			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
			};

			fetch('http://localhost:5200/analizadorJs', requestOptions)
				.then((response) => response.json())
				.then((data) => {
					paginaTokensB(data);
					paginaTokensM(data);
					paginaSintacticosM(data);
					paginaTraduccionJs(data);
					paginaDot(data);
					// console.log(data.dot);
				})
				.catch((error) => console.log('error', error));
			break;
		default:
			alert('Escoge Primero un Tab');
			break;
	}
}

function tabPy() {
	console.log('Tab Py');
}

function tabPrueba() {
	console.log('Tab Prueba 5');
}
