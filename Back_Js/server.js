const express = require('express');
const app = express();
const body = require('body-parser');
const cors = require('cors');
const analizador = require('./analizadorJS');

const port = 5200;

// settings
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
app.use(cors());

//routes
app.post('/analizadorJs', (req, res) => {
	const paraAnalizar = req.body.paraAnalizar;
	const arbol = analizador.parse(paraAnalizar);
	console.log(arbol);
	res.send({ parametro1: arbol, parametro2: 'niño gay' });
});

app.get('/', (req, res) => {
	res.send({ aran: 'que onda aran', niño: 'niño gay' });
});

//Listen
app.listen(port, () => {
	console.log('Back End Js on port ' + port);
});
