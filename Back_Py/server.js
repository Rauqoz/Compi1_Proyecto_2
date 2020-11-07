const express = require('express');
const app = express();
const body = require('body-parser');
const cors = require('cors');
const port = 5300;
const analizadorLexico = require('./lexico');

// settings
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
app.use(cors());

//routes

app.get('/', (req, res) => {
	var texto = 'La Prueba';
	res.send({ prueba: texto });
});

app.post('/analizadorPy', (req, res) => {
	//almaceno req
	const pTexto = req.body.pTexto;
	//analizo lexico
	analizadorLexico.lexico(pTexto);
	//imprimo reportes
	// console.log('-----------Tokens Buenos----------');
	// console.log(analizadorLexico.tokensBuenos);
	// console.log('-----------Tokens Malos----------');
	// console.log(analizadorLexico.tokensMalos);

	//send data
	res.send({ lB: analizadorLexico.tokensBuenos, lM: analizadorLexico.tokensMalos });
});

//Listen
app.listen(port, () => {
	console.log('Back End Py on port ' + port);
});
