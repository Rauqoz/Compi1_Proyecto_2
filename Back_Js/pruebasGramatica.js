const analizador = require('./analizadorJS');
const recorridoArbol = require('./recorrido');

var todo = analizador.parse(`
public class error {


}

`);

function prueba() {
	var x = '';
	x.replace(undefined || 'undefined', '');
	const Reportes = new recorridoArbol();
	console.log('----------------------');
	console.log(Reportes.generar_grafica(todo.raiz));
	// console.log('----------------------');
	// console.log(todo.raiz);
	// console.log('----------------------');
	// console.log(todo.raiz.traduccion());
}

prueba();
