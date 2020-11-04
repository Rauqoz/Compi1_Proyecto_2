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
		armar = '';
	pila.splice(0, pila.length);
	pila.push('start');
	while (ilex < tokens.length) {
		switch (pila[pila.length - 1]) {
			case 'start':
				armar = 'start';
				pila.pop();
				pila.push('lista');
				break;
			case 'lista':
				armar = 'lista';
				if (tokens[ilex].tipo == 'r_public') {
					pila.pop();
					pila.push('lista');
					pila.push('principal');
					pila.push('r_public');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'public/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'l_cerrar');
					ilex++;
				}
				break;
			case 'principal':
				armar = 'principal';
				if (tokens[ilex].tipo == 'r_class') {
					pila.pop();
					pila.push('l_cerrar');
					pila.push('lmetodos');
					pila.push('l_abrir');
					pila.push('r_id');
					pila.push('r_class');
				} else if (tokens[ilex].tipo == 'r_interface') {
					pila.pop();
					pila.push('l_cerrar');
					pila.push('definiciones');
					pila.push('l_abrir');
					pila.push('r_id');
					pila.push('r_interface');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'class/interface/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'l_cerrar');
					ilex++;
					pila.pop();
				}
				break;
			case 'lmetodos':
				armar = 'lmetodos';
				if (tokens[ilex].tipo == 'r_public') {
					pila.pop();
					pila.push('lmetodos');
					pila.push('metodos');
					pila.push('r_public');
				} else if (ltipos(tokens[ilex].tipo)) {
					pila.pop();
					pila.push('lmetodos');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'metodos':
				armar = 'metodos';
				if (tokens[ilex].tipo == 'r_static') {
					pila.pop();
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
					pila.pop();
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('r_void');
				} else if (ltipos(tokens[ilex].tipo) == true) {
					pila.pop();
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
				} else {
					//error
					tokenesperado = 'static/void/tipos/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'l_cerrar');
					ilex++;
					pila.pop();
				}
				break;
			case 'lparametros':
				armar = 'lparametros';
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('parametros');
					pila.push('r_id');
					pila.push('ltipos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'parametros':
				armar = 'parametros';
				if (tokens[ilex].tipo == 'r_coma') {
					pila.pop();
					pila.push('parametros');
					pila.push('r_id');
					pila.push('ltipos');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'ltipos':
				armar = 'ltipos';
				if (tokens[ilex].tipo == 'r_int') {
					pila.pop();
					pila.push('r_int');
				} else if (tokens[ilex].tipo == 'r_double') {
					pila.pop();
					pila.push('r_double');
				} else if (tokens[ilex].tipo == 'r_string') {
					pila.pop();
					pila.push('r_string');
				} else if (tokens[ilex].tipo == 'r_char') {
					pila.pop();
					pila.push('r_char');
				} else if (tokens[ilex].tipo == 'r_boolean') {
					pila.pop();
					pila.push('r_boolean');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'tipos/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
				}
				break;
			case 'linstrucciones':
				armar = 'linstrucciones';
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_id') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('seleccionid');
					pila.push('r_id');
				} else if (tokens[ilex].tipo == 'r_return') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('lreturn');
					pila.push('r_return');
				} else if (tokens[ilex].tipo == 'r_continue') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('r_puntocoma');
					pila.push('r_continue');
				} else if (tokens[ilex].tipo == 'r_break') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('r_puntocoma');
					pila.push('r_break');
				} else if (tokens[ilex].tipo == 'r_system') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('prints');
				} else if (tokens[ilex].tipo == 'r_if') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('mif');
				} else if (tokens[ilex].tipo == 'r_for') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('mfor');
				} else if (tokens[ilex].tipo == 'r_while') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('mwhile');
				} else if (tokens[ilex].tipo == 'r_do') {
					pila.pop();
					pila.push('linstrucciones');
					pila.push('mdo');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'declaracion':
				armar = 'declaracion';
				pila.pop();
				pila.push('r_puntocoma');
				pila.push('ldeclaracion');
				pila.push('r_id');
				pila.push('ltipos');
				break;
			case 'ldeclaracion':
				armar = 'ldeclaracion';
				if (tokens[ilex].tipo == 'r_coma') {
					pila.pop();
					pila.push('ldeclaracion');
					pila.push('r_id');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_igual') {
					pila.pop();
					pila.push('mdeclaracion');
					pila.push('lexpresion');
					pila.push('r_igual');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'mdeclaracion':
				armar = 'mdeclaracion';
				if (tokens[ilex].tipo == 'r_coma') {
					pila.pop();
					pila.push('ldeclaracion');
					pila.push('r_id');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'lexpresion':
				armar = 'lexpresion';
				if (tokens[ilex].tipo == 'r_mas') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_mas');
				} else if (tokens[ilex].tipo == 'r_menos') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_menos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					pila.pop();
					pila.push('expresion');
				}
				break;
			case 'expresion':
				armar = 'expresion';
				if (tokens[ilex].tipo == 'r_numero') {
					pila.pop();
					pila.push('operacion');
					pila.push('r_numero');
				} else if (tokens[ilex].tipo == 'r_cadena') {
					pila.pop();
					pila.push('operacion');
					pila.push('r_cadena');
				} else if (tokens[ilex].tipo == 'r_caracter') {
					pila.pop();
					pila.push('operacion');
					pila.push('r_caracter');
				} else if (booleano(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('operacion');
					pila.push('booleano');
				} else if (tokens[ilex].tipo == 'r_id') {
					pila.pop();
					pila.push('operacion');
					pila.push('emetodo');
					pila.push('r_id');
				} else if (tokens[ilex].tipo == 'p_abrir') {
					pila.pop();
					pila.push('operacion');
					pila.push('p_cerrar');
					pila.push('lexpresion');
					pila.push('p_abrir');
				} else if (tokens[ilex].tipo == 'r_not') {
					pila.pop();
					pila.push('operacion');
					pila.push('expresion');
					pila.push('r_not');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'expresion/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
				}
				break;
			case 'operacion':
				armar = 'operacion';
				if (tokens[ilex].tipo == 'r_mas') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_mas');
				} else if (tokens[ilex].tipo == 'r_menos') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_menos');
				} else if (tokens[ilex].tipo == 'r_asterisco') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_asterisco');
				} else if (tokens[ilex].tipo == 'r_diagonal') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_diagonal');
				} else if (tokens[ilex].tipo == 'r_masmas') {
					pila.pop();
					pila.push('operacion');
					pila.push('r_masmas');
				} else if (tokens[ilex].tipo == 'r_menosmenos') {
					pila.pop();
					pila.push('operacion');
					pila.push('r_menosmenos');
				} else if (tokens[ilex].tipo == 'r_menor') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_menor');
				} else if (tokens[ilex].tipo == 'r_mayor') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_mayor');
				} else if (tokens[ilex].tipo == 'r_mayorigual') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_mayorigual');
				} else if (tokens[ilex].tipo == 'r_menorigual') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_menorigual');
				} else if (tokens[ilex].tipo == 'r_igualigual') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_igualigual');
				} else if (tokens[ilex].tipo == 'r_notigual') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_notigual');
				} else if (tokens[ilex].tipo == 'r_and') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_and');
				} else if (tokens[ilex].tipo == 'r_or') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_or');
				} else if (tokens[ilex].tipo == 'r_xor') {
					pila.pop();
					pila.push('expresion');
					pila.push('r_xor');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'booleano':
				armar = 'booleano';
				if (tokens[ilex].tipo == 'r_true') {
					pila.pop();
					pila.push('r_true');
				} else if (tokens[ilex].tipo == 'r_false') {
					pila.pop();
					pila.push('r_false');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'true/false/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
				}
				break;
			case 'emetodo':
				armar = 'emetodo';
				if (tokens[ilex].tipo == 'p_abrir') {
					pila.pop();
					pila.push('p_cerrar');
					pila.push('lvalores');
					pila.push('p_abrir');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'lvalores':
				armar = 'lvalores';
				if (expresion(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('valores');
					pila.push('expresion');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'valores':
				armar = 'valores';
				if (tokens[ilex].tipo == 'r_coma') {
					pila.pop();
					pila.push('valores');
					pila.push('lexpresion');
					pila.push('r_coma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'seleccionid':
				armar = 'seleccionid';
				if (tokens[ilex].tipo == 'p_abrir') {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lvalores');
					pila.push('p_abrir');
				} else if (tokens[ilex].tipo == 'r_igual') {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('lexpresion');
					pila.push('r_igual');
				} else if (tokens[ilex].tipo == 'r_masmas') {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('r_masmas');
				} else if (tokens[ilex].tipo == 'r_menosmenos') {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('r_menosmenos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = '(/=/++/--/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
					pila.pop();
				}
				break;
			case 'lreturn':
				armar = 'lreturn';
				if (lexpresion(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('lexpresion');
				} else if (tokens[ilex].tipo == 'r_puntocoma') {
					pila.pop();
					pila.push('r_puntocoma');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'lexpresion/;/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
				}
				break;
			case 'prints':
				armar = 'prints';
				if (tokens[ilex].tipo == 'r_system') {
					pila.pop();
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
				} else {
					//error
					tokenesperado = 'system/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
				}
				break;
			case 'lprints':
				armar = 'lprints';
				if (tokens[ilex].tipo == 'r_print') {
					pila.pop();
					pila.push('r_print');
				} else if (tokens[ilex].tipo == 'r_println') {
					pila.pop();
					pila.push('r_println');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'print/println/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma');
					ilex++;
				}
				break;
			case 'mif':
				armar = 'mif';
				pila.pop();
				pila.push('lif');
				pila.push('l_cerrar');
				pila.push('linstrucciones');
				pila.push('l_abrir');
				pila.push('p_cerrar');
				pila.push('lexpresion');
				pila.push('p_abrir');
				pila.push('r_if');
				break;
			case 'lif':
				armar = 'lif';
				if (tokens[ilex].tipo == 'r_else') {
					pila.pop();
					pila.push('melse');
					pila.push('r_else');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'melse':
				armar = 'melse';
				if (tokens[ilex].tipo == 'r_if') {
					pila.pop();
					pila.push('mif');
				} else if (tokens[ilex].tipo == 'l_abrir') {
					pila.pop();
					pila.push('lif');
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'if/{/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'l_cerrar');
					ilex++;
				}
				break;
			case 'mfor':
				armar = 'mfor';
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
				break;
			case 'mwhile':
				armar = 'mwhile';
				pila.pop();
				pila.push('l_cerrar');
				pila.push('linstrucciones');
				pila.push('l_abrir');
				pila.push('p_cerrar');
				pila.push('lexpresion');
				pila.push('p_abrir');
				pila.push('r_while');
				break;
			case 'mdo':
				armar = 'mdo';
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
				break;
			case 'definiciones':
				armar = 'definiciones';
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('definiciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_public') {
					pila.pop();
					pila.push('lmetodosdefiniciones');
					pila.push('r_public');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'lmetodosdefiniciones':
				armar = 'lmetodosdefiniciones';
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('lmetodosdefiniciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_public') {
					pila.pop();
					pila.push('lmetodosdefiniciones');
					pila.push('metodosdefiniciones');
					pila.push('r_public');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//vacio
					pila.pop();
				}
				break;
			case 'metodosdefiniciones':
				armar = 'metodosdefiniciones';
				if (tokens[ilex].tipo == 'r_public') {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('r_void');
				} else if (ltipos(tokens[ilex].tipo) == true) {
					pila.pop();
					pila.push('r_puntocoma');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('ltipos');
				} else if (tokens[ilex].tipo == 'r_comentario') {
					console.log('era comentario');
					ilex++;
				} else {
					//error
					tokenesperado = 'public/tipos/comentario';
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'l_cerrar');
					ilex++;
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
							tokens[ilex].tipo +
							' estaba en ' +
							armar
					);
					buenasAcumuladas_AF.push(tokens[ilex].palabra);
					pila.pop();
					ilex++;
				} else {
					console.log('Error con: ' + tokens[ilex].palabra + ' dato en pila ' + pila[pila.length - 1]);
					erroresSinctacticos.push(new errorS(tokens[ilex].palabra, tokenesperado, tokens[ilex].fila));

					do {
						ilex++;
					} while (tokens[ilex].tipo != 'r_puntocoma' && tokens[ilex].tipo != 'l_cerrar');
					ilex++;
					do {
						pila.pop();
					} while (pila[pila.length - 1] != 'r_puntocoma' && pila[pila.length - 1] != 'l_cerrar');
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
public class Hola {
//comentario 
public static void main(String[] args){
i++;
}
	
}

public interface hola2 {

}



`;
// prueba();
lexico.lexico(texto);
// lexico.printL();
sintactico(lexico.tokensBuenos);
printLn();
