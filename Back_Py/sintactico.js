const lexico = require('./lexico');

class errorS {
	constructor(pmala, pbuena, fila) {
		this.pmala = pmala;
		this.pbuena = pbuena;
		this.fila = fila;
	}
}

var pila = [],
	buenasAcumuladas_AF = [],
	erroresSinctacticos = [];

//tipos

function ltipos(token) {
	if (token == 'r_int' || token == 'r_double' || token == 'r_string' || token == 'r_char' || token == 'r_boolean') {
		return true;
	} else {
		return false;
	}
}

function booleano(token) {
	if (token == 'r_true' || token == 'r_false') {
		return true;
	} else {
		return false;
	}
}

function expresion(token) {
	if (
		token == 'r_numero' ||
		token == 'r_cadena' ||
		token == 'r_caracter' ||
		booleano(token) == true ||
		token == 'r_id' ||
		token == 'p_abrir' ||
		token == 'r_not'
	) {
		return true;
	} else {
		return false;
	}
}

function lexpresion(token) {
	if (token == 'r_mas' || token == 'r_menos' || expresion(token) == true) {
		return true;
	} else {
		return false;
	}
}

function sintactico(tokens) {
	var ilex = 0;
	var tokenesperado = '',
		precuperacion = '';
	pila.splice(0, pila.length);
	pila.push('start');
	while (ilex < tokens.length) {
		switch (pila[pila.length - 1]) {
			case 'start':
				pila.pop();
				pila.push('lista');
				break;
			case 'lista':
				pila.pop();
				if (tokens[ilex].tipo == 'r_public') {
					pila.push('lista');
					pila.push('principal');
					pila.push('r_public');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lista');
				} else {
					//error
					tokenesperado = 'r_public';
				}
				break;
			case 'principal':
				pila.pop();
				if (tokens[ilex].tipo == 'r_class') {
					precuperacion = 'lmetodos';
					pila.push('l_cerrar');
					pila.push('lmetodos');
					pila.push('l_abrir');
					pila.push('r_id');
					pila.push('r_class');
				} else if (tokens[ilex].tipo == 'r_interface') {
					precuperacion = 'definiciones';
					pila.push('l_cerrar');
					pila.push('definiciones');
					pila.push('l_abrir');
					pila.push('r_id');
					pila.push('r_interface');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('principal');
				} else {
					//error
					tokenesperado = 'r_class/r_interface';
				}
				break;
			case 'lmetodos':
				pila.pop();
				if (tokens[ilex].tipo == 'r_public') {
					pila.push('lmetodos');
					pila.push('metodos');
					pila.push('r_public');
				} else if (ltipos(tokens[ilex].tipo)) {
					pila.push('lmetodos');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lmetodos');
				} else {
					//vacio
					tokenesperado = 'r_public/tipos';
				}
				break;
			case 'metodos':
				pila.pop();
				if (tokens[ilex].tipo == 'r_static') {
					precuperacion = 'linstrucciones';
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('r_args');
					pila.push('c_cerrar');
					pila.push('c_abrir');
					pila.push('r_string');
					pila.push('p_abrir');
					pila.push('r_main');
					pila.push('r_void');
					pila.push('r_static');
				} else if (tokens[ilex].tipo == 'r_void') {
					precuperacion = 'linstrucciones';
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('r_void');
				} else if (ltipos(tokens[ilex].tipo) == true) {
					precuperacion = 'linstrucciones';
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('ltipos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('metodos');
				} else {
					//error
					tokenesperado = 'r_static/r_void/tipos';
				}
				break;
			case 'lparametros':
				pila.pop();
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('parametros');
					pila.push('r_id');
					pila.push('ltipos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lparametros');
				} else {
					//vacio
					tokenesperado = 'tipos';
				}
				break;
			case 'parametros':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('parametros');
					pila.push('r_id');
					pila.push('ltipos');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('parametros');
				} else {
					//vacio
					tokenesperado = 'r_coma';
				}
				break;
			case 'ltipos':
				pila.pop();
				if (tokens[ilex].tipo == 'r_int') {
					pila.push('r_int');
				} else if (tokens[ilex].tipo == 'r_double') {
					pila.push('r_double');
				} else if (tokens[ilex].tipo == 'r_string') {
					pila.push('r_string');
				} else if (tokens[ilex].tipo == 'r_char') {
					pila.push('r_char');
				} else if (tokens[ilex].tipo == 'r_boolean') {
					pila.push('r_boolean');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('ltipos');
				} else {
					//error
					tokenesperado = 'tipos';
				}
				break;
			case 'linstrucciones':
				pila.pop();
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('linstrucciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_id') {
					pila.push('linstrucciones');
					pila.push('seleccionid');
					pila.push('r_id');
				} else if (tokens[ilex].tipo == 'r_return') {
					pila.push('linstrucciones');
					pila.push('lreturn');
					pila.push('r_return');
				} else if (tokens[ilex].tipo == 'r_continue') {
					pila.push('linstrucciones');
					pila.push('r_puntocoma');
					pila.push('r_continue');
				} else if (tokens[ilex].tipo == 'r_break') {
					pila.push('linstrucciones');
					pila.push('r_puntocoma');
					pila.push('r_break');
				} else if (tokens[ilex].tipo == 'r_system') {
					pila.push('linstrucciones');
					pila.push('prints');
				} else if (tokens[ilex].tipo == 'r_if') {
					pila.push('linstrucciones');
					pila.push('mif');
				} else if (tokens[ilex].tipo == 'r_for') {
					pila.push('linstrucciones');
					pila.push('mfor');
				} else if (tokens[ilex].tipo == 'r_while') {
					pila.push('linstrucciones');
					pila.push('mwhile');
				} else if (tokens[ilex].tipo == 'r_do') {
					pila.push('linstrucciones');
					pila.push('mdo');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('linstrucciones');
				} else {
					//vacio
					tokenesperado = 'instrucciones';
				}
				break;
			case 'declaracion':
				pila.pop();
				pila.push('r_puntocoma');
				pila.push('ldeclaracion');
				pila.push('r_id');
				pila.push('ltipos');
				if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('declaracion');
				}
				break;
			case 'ldeclaracion':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('ldeclaracion');
					pila.push('r_id');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_igual') {
					pila.push('mdeclaracion');
					pila.push('lexpresion');
					pila.push('r_igual');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('ldeclaracion');
				} else {
					//vacio
					tokenesperado = 'r_coma/r_igual';
				}
				break;
			case 'mdeclaracion':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('ldeclaracion');
					pila.push('r_id');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('mdeclaracion');
				} else {
					//vacio
					tokenesperado = 'r_coma';
				}
				break;
			case 'lexpresion':
				pila.pop();
				if (tokens[ilex].tipo == 'r_mas') {
					pila.push('expresion');
					pila.push('r_mas');
				} else if (tokens[ilex].tipo == 'r_menos') {
					pila.push('expresion');
					pila.push('r_menos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lexpresion');
				} else {
					pila.push('expresion');
				}
				break;
			case 'expresion':
				pila.pop();
				if (tokens[ilex].tipo == 'r_numero') {
					pila.push('operacion');
					pila.push('r_numero');
				} else if (tokens[ilex].tipo == 'r_cadena') {
					pila.push('operacion');
					pila.push('r_cadena');
				} else if (tokens[ilex].tipo == 'r_caracter') {
					pila.push('operacion');
					pila.push('r_caracter');
				} else if (booleano(tokens[ilex].tipo) == true) {
					pila.push('operacion');
					pila.push('booleano');
				} else if (tokens[ilex].tipo == 'r_id') {
					pila.push('operacion');
					pila.push('emetodo');
					pila.push('r_id');
				} else if (tokens[ilex].tipo == 'p_abrir') {
					pila.push('operacion');
					pila.push('p_cerrar');
					pila.push('lexpresion');
					pila.push('p_abrir');
				} else if (tokens[ilex].tipo == 'r_not') {
					pila.push('operacion');
					pila.push('expresion');
					pila.push('r_not');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('expresion');
				} else {
					//error
					tokenesperado = 'expresion';
				}
				break;
			case 'operacion':
				pila.pop();
				if (tokens[ilex].tipo == 'r_mas') {
					pila.push('expresion');
					pila.push('r_mas');
				} else if (tokens[ilex].tipo == 'r_menos') {
					pila.push('expresion');
					pila.push('r_menos');
				} else if (tokens[ilex].tipo == 'r_asterisco') {
					pila.push('expresion');
					pila.push('r_asterisco');
				} else if (tokens[ilex].tipo == 'r_diagonal') {
					pila.push('expresion');
					pila.push('r_diagonal');
				} else if (tokens[ilex].tipo == 'r_masmas') {
					pila.push('operacion');
					pila.push('r_masmas');
				} else if (tokens[ilex].tipo == 'r_menosmenos') {
					pila.push('operacion');
					pila.push('r_menosmenos');
				} else if (tokens[ilex].tipo == 'r_menor') {
					pila.push('expresion');
					pila.push('r_menor');
				} else if (tokens[ilex].tipo == 'r_mayor') {
					pila.push('expresion');
					pila.push('r_mayor');
				} else if (tokens[ilex].tipo == 'r_mayorigual') {
					pila.push('expresion');
					pila.push('r_mayorigual');
				} else if (tokens[ilex].tipo == 'r_menorigual') {
					pila.push('expresion');
					pila.push('r_menorigual');
				} else if (tokens[ilex].tipo == 'r_igualigual') {
					pila.push('expresion');
					pila.push('r_igualigual');
				} else if (tokens[ilex].tipo == 'r_notigual') {
					pila.push('expresion');
					pila.push('r_notigual');
				} else if (tokens[ilex].tipo == 'r_and') {
					pila.push('expresion');
					pila.push('r_and');
				} else if (tokens[ilex].tipo == 'r_or') {
					pila.push('expresion');
					pila.push('r_or');
				} else if (tokens[ilex].tipo == 'r_xor') {
					pila.push('expresion');
					pila.push('r_xor');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('operacion');
				} else {
					//vacio
					tokenesperado = 'operacion';
				}
				break;
			case 'booleano':
				pila.pop();
				if (tokens[ilex].tipo == 'r_true') {
					pila.push('r_true');
				} else if (tokens[ilex].tipo == 'r_false') {
					pila.push('r_false');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('booleano');
				} else {
					//error
					tokenesperado = 'booleano';
				}
				break;
			case 'emetodo':
				pila.pop();
				if (tokens[ilex].tipo == 'p_abrir') {
					pila.push('p_cerrar');
					pila.push('lvalores');
					pila.push('p_abrir');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('emetodo');
				} else {
					//vacio
					tokenesperado = 'p_abrir';
				}
				break;
			case 'lvalores':
				pila.pop();
				if (expresion(tokens[ilex].tipo) == true) {
					pila.push('valores');
					pila.push('expresion');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lvalores');
				} else {
					//vacio
					tokenesperado = 'expresion';
				}
				break;
			case 'valores':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('valores');
					pila.push('lexpresion');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('valores');
				} else {
					//vacio
					tokenesperado = 'r_coma';
				}
				break;
			case 'seleccionid':
				pila.pop();
				if (tokens[ilex].tipo == 'p_abrir') {
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lvalores');
					pila.push('p_abrir');
				} else if (tokens[ilex].tipo == 'r_igual') {
					pila.push('r_puntocoma');
					pila.push('lexpresion');
					pila.push('r_igual');
				} else if (tokens[ilex].tipo == 'r_masmas') {
					pila.push('r_puntocoma');
					pila.push('r_masmas');
				} else if (tokens[ilex].tipo == 'r_menosmenos') {
					pila.push('r_puntocoma');
					pila.push('r_menosmenos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('seleccionid');
				} else {
					//error
					tokenesperado = 'p_abrir/r_igual';
				}
				break;
			case 'lreturn':
				pila.pop();
				if (lexpresion(tokens[ilex].tipo) == true) {
					pila.push('r_puntocoma');
					pila.push('lexpresion');
				} else if (tokens[ilex].tipo == 'r_puntocoma') {
					pila.push('r_puntocoma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lreturn');
				} else {
					//error
					tokenesperado = 'lexpresion/r_puntocoma';
				}
				break;
			case 'prints':
				pila.pop();
				if (tokens[ilex].tipo == 'r_system') {
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lexpresion');
					pila.push('p_abrir');
					pila.push('lprints');
					pila.push('r_punto');
					pila.push('r_out');
					pila.push('r_punto');
					pila.push('r_system');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('prints');
				} else {
					//error
					tokenesperado = 'r_system';
				}
				break;
			case 'lprints':
				pila.pop();
				if (tokens[ilex].tipo == 'r_print') {
					pila.push('r_print');
				} else if (tokens[ilex].tipo == 'r_println') {
					pila.push('r_println');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lprints');
				}
				break;
			case 'mif':
				pila.pop();
				pila.push('lif');
				pila.push('l_cerrar');
				pila.push('linstrucciones');
				pila.push('l_abrir');
				pila.push('p_cerrar');
				pila.push('lexpresion');
				pila.push('p_abrir');
				pila.push('r_if');
				if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('mif');
				}
				break;
			case 'lif':
				pila.pop();
				if (tokens[ilex].tipo == 'r_else') {
					pila.push('melse');
					pila.push('r_else');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lif');
				} else {
					//vacio
					tokenesperado = 'r_else';
				}
				break;
			case 'melse':
				pila.pop();
				if (tokens[ilex].tipo == 'r_if') {
					pila.push('mif');
				} else if (tokens[ilex].tipo == 'l_abrir') {
					pila.push('lif');
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('melse');
				} else {
					//error
					tokenesperado = 'r_if/l_abrir';
				}
				break;
			case 'mfor':
				pila.pop();
				pila.push('l_cerrar');
				pila.push('linstrucciones');
				pila.push('l_abrir');
				pila.push('p_cerrar');
				pila.push('lexpresion');
				pila.push('r_puntocoma');
				pila.push('lexpresion');
				pila.push('declaracion');
				pila.push('p_abrir');
				pila.push('r_for');
				if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('mfor');
				}
				break;
			case 'mwhile':
				pila.pop();
				pila.push('l_cerrar');
				pila.push('linstrucciones');
				pila.push('l_abrir');
				pila.push('p_cerrar');
				pila.push('lexpresion');
				pila.push('p_abrir');
				pila.push('r_while');
				if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('mwhile');
				}
				break;
			case 'mdo':
				pila.pop();
				pila.push('r_puntocoma');
				pila.push('p_cerrar');
				pila.push('lexpresion');
				pila.push('p_abrir');
				pila.push('r_while');
				pila.push('l_cerrar');
				pila.push('linstrucciones');
				pila.push('l_abrir');
				pila.push('r_do');
				if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('mdo');
				}
				break;
			case 'definiciones':
				pila.pop();
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('definiciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_public') {
					pila.push('lmetodosdefiniciones');
					pila.push('r_public');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('definiciones');
				} else {
					//vacio
					tokenesperado = 'r_public/tipos';
				}
				break;
			case 'lmetodosdefiniciones':
				pila.pop();
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('lmetodosdefiniciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_public') {
					pila.push('lmetodosdefiniciones');
					pila.push('metodosdefiniciones');
					pila.push('r_public');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('lmetodosdefiniciones');
				} else {
					//vacio
					tokenesperado = 'r_public/tipos';
				}
				break;
			case 'metodosdefiniciones':
				pila.pop();
				if (tokens[ilex].tipo == 'r_public') {
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('r_void');
				} else if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('ltipos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
					pila.push('metodosdefiniciones');
				} else {
					//error
					tokenesperado = 'r_public/tipos';
				}
				break;

			default:
				if (pila[pila.length - 1] == tokens[ilex].tipo) {
					console.log(
						'pila: ' +
							pila[pila.length - 1] +
							' token ' +
							tokens[ilex].palabra +
							' tipo ' +
							tokens[ilex].tipo
					);
					buenasAcumuladas_AF.push(tokens[ilex].palabra);
					pila.pop();
					ilex++;
				} else {
					console.log('Error con: ' + tokens[ilex].palabra + ' en lugar de ' + tokenesperado);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));
					let recover;
					while (tokens[ilex].tipo != 'r_puntocoma' && tokens[ilex].tipo != 'l_cerrar') {
						if (tokens[ilex + 1].tipo == 'r_puntocoma') {
							recover = 'r_puntocoma';
						} else if (tokens[ilex + 1].tipo == 'l_cerrar') {
							recover = 'l_cerrar';
						}
						ilex++;
					}
					ilex++;
					while (pila[pila.length - 1] != 'r_puntocoma' && pila[pila.length - 1] != 'l_cerrar') {
						pila.pop();
					}
					pila.pop();
					console.log('pila');
					console.log(pila);
					if (precuperacion.length != 0) {
						pila.push(precuperacion);
					}
				}
				break;
		}
	}
	console.log('Sintactico Fin');
}

function printLn() {
	console.log('----Sintactico Buenos----');
	console.log(buenasAcumuladas_AF);
	console.log('----Sintactico Malos----');
	console.log(erroresSinctacticos);
}

function prueba() {
	console.log(pila);
	console.log(pila.indexOf(3));
	console.log(pila.length);
	pila.splice(0, pila.length);
	console.log(pila);
}

var texto = `
public class Hola{

	public void metodo(int a, int b, int c, int d){
		
		incremento++;
		
	}
}


`;
// prueba();
lexico.lexico(texto);
// lexico.printL();
sintactico(lexico.tokensBuenos);
printLn();
