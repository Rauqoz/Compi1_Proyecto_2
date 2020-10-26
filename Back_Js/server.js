const express = require('express');
const app = express();
const body = require('body-parser');
const cors = require('cors');
const prueba = require('./prueba');
const port = 5100;

// settings
app.use(body.json());
app.use(body.urlencoded({ extended: false }));
app.use(cors());

//routes

app.get('/', (req, res) => {
	var texto = 'La Prueba';
	res.send({ prueba: texto });
});

app.post('/prueba', (req, res) => {
	var p = prueba.parse(req.body.data);
	res.send('recibio datos ' + p);
});

//Listen
app.listen(port, () => {
	console.log('Back End Js on port ' + port);
});
