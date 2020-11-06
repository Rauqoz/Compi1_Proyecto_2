'use stric';

// TAB

var tabActiva;
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

function tabOpen() {
	console.log('Tab Open');
}
function tabNuevo() {
	console.log('Tab Nuevo');
}
function tabGuardar() {
	console.log('Tab Guardar');
}

function tabAmbos() {
	// editor.getDoc().setValue(editor.getDoc().getValue() + "var ");
	// console.log(editor.getDoc().getValue());
	// switch (tabActiva) {
	// 	case 'p1':
	// 		console.log(window.code1.getDoc().getValue());
	// 		break;
	// 	case 'p2':
	// 		console.log(window.code2.getDoc().getValue());
	// 		break;
	// 	case 'p3':
	// 		console.log(window.code3.getDoc().getValue());
	// 		break;
	// 	case 'p4':
	// 		console.log(window.code4.getDoc().getValue());
	// 		break;
	// 	default:
	// 		alert('Escoge Primero un Tab');
	// 		break;
	// }
	console.log('Tab Ambos');
}

function tabJs() {
	console.log('Tab Js');
}

function tabPy() {
	console.log('Tab Py');
}

function tabPrueba() {
	console.log('Tab Prueba');
}
