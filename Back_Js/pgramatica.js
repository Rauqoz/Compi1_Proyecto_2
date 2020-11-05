const parser = require('./analizadorJS');
const nodo = require('./arbol');

function prueba() {
	var todo = parser.parse(`public class hola {

    }`);
	console.log(todo);
}

prueba();
