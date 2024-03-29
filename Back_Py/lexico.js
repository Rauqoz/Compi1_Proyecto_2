//Desarrollo Lexico Java
//ER
//L(N|L|S)* | N+(SN+)? | ST*S | SLS | SS? | SST*(SS)?
class token {
	constructor(palabra, tipo, fila, columna) {
		this.palabra = palabra;
		this.tipo = tipo;
		this.fila = fila;
		this.columna = columna;
	}
}

class errorToken {
	constructor(palabra, fila, columna) {
		this.palabra = palabra;
		this.fila = fila;
		this.columna = columna;
	}
}

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
	var isSimbolo = /[\%|\+|\-|\*|\/|\<|\>|\=|\!|\&|\||\^|\,|\:|\;|\(|\)|\{|\}|\[|\]|\"|\'|\.]/i;

	var simbolos = [
		[ '%', 'r_modular' ],
		[ '+', 'r_mas' ],
		[ '-', 'r_menos' ],
		[ '*', 'r_asterisco' ],
		[ '/', 'r_diagonal' ],
		[ '++', 'r_masmas' ],
		[ '--', 'r_menosmenos' ],
		[ '<', 'r_menor' ],
		[ '>', 'r_mayor' ],
		[ '=', 'r_igual' ],
		[ '!', 'r_not' ],
		[ '&&', 'r_and' ],
		[ '||', 'r_or' ],
		[ '^', 'r_xor' ],
		[ '<=', 'r_menorigual' ],
		[ '>=', 'r_mayorigual' ],
		[ '==', 'r_igualigual' ],
		[ '!=', 'r_notigual' ],
		[ ',', 'r_coma' ],
		[ ':', 'r_dospuntos' ],
		[ ';', 'r_puntocoma' ],
		[ '(', 'p_abrir' ],
		[ ')', 'p_cerrar' ],
		[ '{', 'l_abrir' ],
		[ '}', 'l_cerrar' ],
		[ '[', 'c_abrir' ],
		[ ']', 'c_cerrar' ],
		[ '.', 'r_punto' ]
	];

	var reservadas = [
		'true',
		'false',
		'int',
		'string',
		'double',
		'boolean',
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

	var comentariol = false,
		comentariom = false,
		caracter = false,
		cadena = false,
		signodoble = false;

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
					if (letra[i] == '"') {
						i++;
						cadena = true;
					} else if (letra[i] == "'") {
						i++;
						caracter = true;
					} else if (letra[i] == '/' && letra[i + 1] == '/') {
						i++;
						comentariol = true;
					} else if (letra[i] == '/' && letra[i + 1] == '*') {
						i++;
						comentariom = true;
					} else if (letra[i] == '+' && letra[i + 1] == '+') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '&' && letra[i + 1] == '&') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '-' && letra[i + 1] == '-') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '|' && letra[i + 1] == '|') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '<' && letra[i + 1] == '=') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '>' && letra[i + 1] == '=') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '=' && letra[i + 1] == '=') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					} else if (letra[i] == '!' && letra[i + 1] == '=') {
						palabraArmada += letra[i];
						signodoble = true;
						i++;
					}
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
					for (let y in reservadas) {
						if (palabraArmada == reservadas[y]) {
							bandera = true;
							tokensBuenos.push(new token(palabraArmada, 'r_' + reservadas[y], filaE, columnaE));
							break;
						}
					}
					if (bandera == false) {
						tokensBuenos.push(new token(palabraArmada, 'r_id', filaE, columnaE));
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
					tokensBuenos.push(new token(palabraArmada, 'r_numero', filaE, columnaE));
					palabraArmada = '';
					i--;
					opcion = 'A';
				} else {
					//guarda numero y luego regresa sin registrar el error para separar el token bueno del malo y revisar si es parte de un nuevo token bueno
					tokensBuenos.push(new token(palabraArmada, 'r_numero', filaE, columnaE));
					palabraArmada = '';
					i--;
					opcion = 'A';
				}
				break;

			case 'D':
				if (caracter) {
					columnaE++;
					palabraArmada += letra[i];
					opcion = 'F';
				} else if (cadena) {
					columnaE++;
					palabraArmada += letra[i];
					opcion = 'H';
				} else if (comentariol) {
					columnaE++;
					opcion = 'G';
				} else if (comentariom) {
					columnaE++;
					opcion = 'G';
				} else if (signodoble) {
					columnaE++;
					palabraArmada += letra[i];
					for (let y in simbolos) {
						if (palabraArmada == simbolos[y][0]) {
							tokensBuenos.push(new token(palabraArmada, simbolos[y][1], filaE, columnaE));
							break;
						}
					}
					signodoble = false;
					palabraArmada = '';
					opcion = 'A';
				} else {
					columnaE++;
					for (let y in simbolos) {
						if (letra[i] == simbolos[y][0]) {
							tokensBuenos.push(new token(letra[i], simbolos[y][1], filaE, columnaE));
							break;
						}
					}
					palabraArmada = '';
					opcion = 'A';
				}
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
					tokensBuenos.push(new token(palabraArmada, 'r_numero', filaE, columnaE));
					i--;
					palabraArmada = '';
					opcion = 'A';
				} else {
					//guarda numero y luego regresa sin registrar el error para separar el token bueno del malo y revisar si es parte de un nuevo token bueno
					palabraArmada += '0';
					tokensBuenos.push(new token(palabraArmada, 'r_numero', filaE, columnaE));
					i--;
					palabraArmada = '';
					opcion = 'A';
				}
				break;

			case 'F':
				if (letra[i] == "'") {
					i--;
					opcion = 'J';
				}
				break;

			case 'G':
				if (comentariol) {
					if (letra[i].match(isSaltoLine)) {
						comentariol = false;
						filaE++;
						tokensBuenos.push(new token(palabraArmada, 'r_comentario', filaE, columnaE));
						palabraArmada = '';
						opcion = 'A';
					} else {
						palabraArmada += letra[i];
						columnaE++;
					}
				} else if (comentariom) {
					if (letra[i] == '*' && letra[i + 1] == '/') {
						columnaE++;
						opcion = 'K';
					} else {
						palabraArmada += letra[i];
						columnaE++;
					}
				}
				break;

			case 'H':
				if (letra[i] == '"') {
					i--;
					opcion = 'J';
				} else {
					columnaE++;
					palabraArmada += letra[i];
				}
				break;

			case 'I':
				if (letra[i].match(isNumero)) {
					columnaE++;
					palabraArmada += letra[i];
				} else if (letra[i].match(isSpace) || letra[i].match(isSimbolo)) {
					tokensBuenos.push(new token(palabraArmada, 'r_numero', filaE, columnaE));
					i--;
					palabraArmada = '';
					opcion = 'A';
				} else {
					//guarda numero y luego regresa sin registrar el error para separar el token bueno del malo y revisar si es parte de un nuevo token bueno
					tokensBuenos.push(new token(palabraArmada, 'r_numero', filaE, columnaE));
					i--;
					palabraArmada = '';
					opcion = 'A';
				}
				break;

			case 'J':
				if (caracter) {
					caracter = false;
					columnaE++;
					tokensBuenos.push(new token(palabraArmada, 'r_caracter', filaE, columnaE));
					palabraArmada = '';
					opcion = 'A';
				} else if (cadena) {
					cadena = false;
					columnaE++;
					tokensBuenos.push(new token(palabraArmada, 'r_cadena', filaE, columnaE));
					palabraArmada = '';
					opcion = 'A';
				} else if (comentariom) {
					comentariom = false;
					columnaE++;
					tokensBuenos.push(new token(palabraArmada, 'r_comentario', filaE, columnaE));
					palabraArmada = '';
					opcion = 'A';
				}
				break;

			case 'K':
				if (letra[i] == '/') {
					i--;
					opcion = 'J';
				}
				break;

			default:
				break;
		}
	}
}

function printL() {
	console.log('----Tokens Buenos----');
	console.log(tokensBuenos);
	console.log('----Tokens Malos----');
	console.log(tokensMalos);
}

// lexico(prueba);
// printL();

module.exports = { tokensBuenos, tokensMalos, lexico };
