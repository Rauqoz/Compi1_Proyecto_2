const express = require('express');
const app = express();
const body = require('body-parser');
const cors = require('cors');
const analizador = require('./analizadorJS');
const recorridoArbol = require('./recorrido');

const port = 5200;

// settings
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
app.use(cors());

//routes
app.post('/analizadorJs', (req, res) => {
	//variable reportes
	const Reportes = new recorridoArbol();
	//almacena el req
	const pTexto = req.body.pTexto;
	//analizo
	const todo = analizador.parse(pTexto);
	const dot = Reportes.generar_grafica(todo.raiz);
	const traduccion = todo.raiz.traduccion();
	//imprimo reportes
	// console.log('-----------Raiz----------');
	// console.log(todo.raiz);
	// console.log('-----------Tokens Buenos----------');
	// console.log(todo.lexicoB);
	// console.log('-----------Tokens Malos----------');
	// console.log(todo.lexicoM);
	// console.log('-----------Sintactico Malos----------');
	// console.log(todo.sintacticoM);
	// console.log('-----------Dot----------');
	// console.log(dot);

	//send data
	res.send({
		lB: todo.lexicoB,
		lM: todo.lexicoM,
		sM: todo.sintacticoM,
		dot: dot,
		trad: traduccion,
		alfarito: 'Que Guapa Estas'
	});
});

app.get('/', (req, res) => {
	res.send({ aran: 'que onda aran', niño: 'niño gay' });
});

//Listen
app.listen(port, () => {
	console.log('Back End Js on port ' + port);
});
