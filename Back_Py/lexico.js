//Desarrollo Lexico Java
//ER
//L(N|L|S)* | N+(SN+)? | ST*S | SLS | SS? | SST*(SS)?
class token {
	constructor(palabra, tipo) {
		this.palabra = palabra;
		this.tipo = tipo;
	}
}

class errorToken {
	constructor(palabra, fila, columna) {
		this.palabra = palabra;
		this.fila = fila;
		this.columna = columna;
	}
}

var prueba = `56.main 20Pedro_elmanco 15.9 1 0El_Niño_Gay15`;
var tokensBuenos = [],
	tokensMalos = [];

function lexico(texto) {
	console.log('Lexico');
	var opcion = 'A',
		palabraArmada = '',
		filaE = 1,
		columnaE = 1;

	var isLetra = /[a-z]|ñ/i;
	var isNumero = /[0-9]/i;
	var isSpace = /\s|\t/i;
	var isSaltoLine = /\n/i;
	var isSimbolo = /[\%|\+|\-|\*|\/|\<|\>|\=|\!|\&|\||\^|\,|\:|\;|\(|\)|\{|\}|\[|\]]/i;

	var reservadas = [
		'true',
		'false',
		'int',
		'string',
		'double',
		'bool',
		'char',
		'while',
		'do',
		'if',
		'else',
		'for',
		'switch',
		'case',
		'default',
		'break',
		'continue',
		'return',
		'public',
		'static',
		'void',
		'main',
		'args',
		'class',
		'interface',
		'system',
		'out',
		'print',
		'println'
	];

	var letra = texto.toLowerCase().split('');
	letra.push(' ');
	console.log(letra);

	for (let i = 0; i < letra.length; i++) {
		switch (opcion) {
			case 'A':
				if (letra[i].match(isLetra)) {
					i--;
					opcion = 'B';
				} else if (letra[i].match(isNumero)) {
					i--;
					opcion = 'C';
				} else if (letra[i].match(isSaltoLine)) {
					columnaE = 1;
					filaE++;
				} else if (letra[i].match(isSimbolo)) {
					i--;
					opcion = 'D';
				} else if (letra[i].match(isSpace)) {
					columnaE++;
				} else {
					columnaE++;
					tokensMalos.push(new errorToken(letra[i], filaE, columnaE));
				}
				break;
			case 'B':
				if (letra[i].match(isLetra) || letra[i].match(isNumero) || letra[i] == '_') {
					columnaE++;
					palabraArmada += letra[i];
				} else {
					let bandera = false;
					for (let i in reservadas) {
						if (palabraArmada == reservadas[i]) {
							bandera = true;
							tokensBuenos.push(new token(palabraArmada, 'r_' + reservadas[i]));
						}
					}
					if (bandera == false) {
						tokensBuenos.push(new token(palabraArmada, 'r_id'));
					}
					i--;
					palabraArmada = '';
					opcion = 'A';
				}
				break;

			case 'C':
				if (letra[i].match(isNumero)) {
					columnaE++;
					palabraArmada += letra[i];
				} else if (letra[i] == '.') {
					i--;
					opcion = 'E';
				} else if (letra[i].match(isSpace) || letra[i].match(isSimbolo)) {
					tokensBuenos.push(new token(palabraArmada, 'r_numero'));
					palabraArmada = '';
					i--;
					opcion = 'A';
				} else {
					//guarda numero y luego regresa sin registrar el error para separar el token bueno del malo y revisar si es parte de un nuevo token bueno
					tokensBuenos.push(new token(palabraArmada, 'r_numero'));
					palabraArmada = '';
					i--;
					opcion = 'A';
				}

				break;

			case 'D':
				break;

			case 'E':
				if (letra[i] == '.') {
					columnaE++;
					palabraArmada += letra[i];
				} else if (letra[i].match(isNumero)) {
					i--;
					opcion = 'I';
				} else if (letra[i].match(isSpace) || letra[i].match(isSimbolo)) {
					palabraArmada += '0';
					tokensBuenos.push(new token(palabraArmada, 'r_numero'));
					i--;
					palabraArmada = '';
					opcion = 'A';
				} else {
					//guarda numero y luego regresa sin registrar el error para separar el token bueno del malo y revisar si es parte de un nuevo token bueno
					palabraArmada += '0';
					tokensBuenos.push(new token(palabraArmada, 'r_numero'));
					i--;
					palabraArmada = '';
					opcion = 'A';
				}

				break;

			case 'F':
				break;

			case 'G':
				break;

			case 'H':
				break;

			case 'I':
				if (letra[i].match(isNumero)) {
					columnaE++;
					palabraArmada += letra[i];
				} else if (letra[i].match(isSpace) || letra[i].match(isSimbolo)) {
					tokensBuenos.push(new token(palabraArmada, 'r_numero'));
					i--;
					palabraArmada = '';
					opcion = 'A';
				} else {
					//guarda numero y luego regresa sin registrar el error para separar el token bueno del malo y revisar si es parte de un nuevo token bueno
					tokensBuenos.push(new token(palabraArmada, 'r_numero'));
					i--;
					palabraArmada = '';
					opcion = 'A';
				}

				break;

			case 'J':
				break;

			case 'K':
				break;

			default:
				break;
		}
	}
}

function printL() {
	console.log('----Buenos----');
	console.log(tokensBuenos);
	console.log('----Malos----');
	console.log(tokensMalos);
}

function pruebas(dato) {
	var todo = /[\%|\+|\-|\*|\/|\<|\>|\=|\!|\&|\||\^|\,|\:|\;]/i;
	if (dato.match(todo)) {
		console.log('si tiene');
	} else {
		console.log('nel');
	}
	console.log(dato.match(todo));
}

// pruebas(prueba);
lexico(prueba);
printL();
