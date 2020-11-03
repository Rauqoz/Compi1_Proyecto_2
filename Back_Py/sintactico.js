const lexico = require('./lexico');

class errorS {
	constructor(pmala, pbuena, fila, columna) {
		this.pmala = pmala;
		this.pbuena = pbuena;
		this.fila = fila;
		this.columna = columna;
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
	pila.splice(0, pila.length);
	pila.push('start');
	while (ilex != tokens.length) {
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
				}
				break;
			case 'principal':
				pila.pop();
				if (tokens[ilex].tipo == 'r_class') {
					pila.push('l_cerrar');
					pila.push('lmetodos');
					pila.push('l_abrir');
					pila.push('r_id');
					pila.push('r_class');
				} else if (tokens[ilex].tipo == 'r_interface') {
					pila.push('l_cerrar');
					pila.push('definiciones');
					pila.push('l_abrir');
					pila.push('r_id');
					pila.push('r_interface');
				}
				break;
			case 'lmetodos':
				pila.pop();
				if (tokens[ilex].tipo == 'r_public') {
					pila.push('lmetodos');
					pila.push('metodos');
					pila.push('r_public');
				} else if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('lmetodos');
					pila.push('declaracion');
				} else {
					//vacio
				}
				break;
			case 'metodos':
				pila.pop();
				if (tokens[ilex].tipo == 'r_static') {
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
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('r_void');
				} else if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('lparametros');
					pila.push('p_abrir');
					pila.push('r_id');
					pila.push('ltipos');
				} else {
					//error
				}
				break;
			case 'lparametros':
				pila.pop();
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('parametros');
					pila.push('r_id');
					pila.push('ltipos');
				} else {
					//vacio
				}
				break;
			case 'parametros':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('parametros');
					pila.push('r_id');
					pila.push('r_coma');
				} else {
					//vacio
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
				} else {
					//error
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
				} else {
					//vacio
				}
				break;
			case 'declaracion':
				pila.pop();
				pila.push('r_puntocoma');
				pila.push('ldeclaracion');
				pila.push('r_id');
				pila.push('ltipos');
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
				} else {
					//vacio
				}
				break;
			case 'mdeclaracion':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('ldeclaracion');
					pila.push('r_id');
					pila.push('r_coma');
				} else {
					//vacio
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
				} else {
					//error
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
				} else {
					//vacio
				}
				break;
			case 'booleano':
				pila.pop();
				if (tokens[ilex].tipo == 'r_true') {
					pila.push('r_true');
				} else if (tokens[ilex].tipo == 'r_false') {
					pila.push('r_false');
				} else {
					//error
				}
				break;
			case 'emetodo':
				pila.pop();
				if (tokens[ilex].tipo == 'p_abrir') {
					pila.push('p_cerrar');
					pila.push('lvalores');
					pila.push('p_abrir');
				} else {
					//vacio
				}
				break;
			case 'lvalores':
				pila.pop();
				if (expresion(tokens[ilex].tipo) == true) {
					pila.push('valores');
					pila.push('expresion');
				} else {
					//vacio
				}
				break;
			case 'valores':
				pila.pop();
				if (tokens[ilex].tipo == 'r_coma') {
					pila.push('valores');
					pila.push('lexpresion');
					pila.push('r_coma');
				} else {
					//vacio
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
				} else {
					//error
				}
				break;
			case 'lreturn':
				pila.pop();
				if (lexpresion(tokens[ilex].tipo) == true) {
					pila.push('r_puntocoma');
					pila.push('lexpresion');
				} else if (tokens[ilex].tipo == 'r_puntocoma') {
					pila.push('r_puntocoma');
				} else {
					//error
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
				} else {
					//error
				}
				break;
			case 'lprints':
				pila.pop();
				if (tokens[ilex].tipo == 'r_print') {
					pila.push('r_print');
				} else if (tokens[ilex].tipo == 'r_println') {
					pila.push('r_println');
				}
				break;
			case 'mif':
				pila.pop();
				if (tokens[ilex].tipo == 'r_if') {
					pila.push('lif');
					pila.push('l_cerrar');
					pila.push('linstrucciones');
					pila.push('l_abrir');
					pila.push('p_cerrar');
					pila.push('lexpresion');
					pila.push('p_abrir');
					pila.push('r_if');
				} else {
					//error
				}
				break;
			case 'lif':
				pila.pop();
				if (tokens[ilex].tipo == 'r_else') {
					pila.push('melse');
					pila.push('r_else');
				} else {
					//vacio
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
				} else {
					//error
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
				break;
			case 'definiciones':
				pila.pop();
				if (ltipos(tokens[ilex].tipo) == true) {
					pila.push('definiciones');
					pila.push('declaracion');
				} else if (tokens[ilex].tipo == 'r_public') {
					pila.push('lmetodosdefiniciones');
					pila.push('r_public');
				} else {
					//vacio
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
				} else {
					//vacio
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
				} else {
					//error
				}
				break;

			default:
				console.log(
					'pila: ' + pila[pila.length - 1] + ' token ' + tokens[ilex].palabra + ' tipo ' + tokens[ilex].tipo
				);
				if (pila[pila.length - 1] == tokens[ilex].tipo) {
					buenasAcumuladas_AF.push(tokens[ilex].palabra);
					pila.pop();
					ilex++;
				}
				break;
		}
	}
	console.log('Sintactico Fin');
	console.log(pila);
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
	int x = Quetal(3, 9+3, -2, Hola(x+(3*3)));     
	public static void main(String[] args){
		int t,y,u;
	}
}

public interface Hola2{
	int x = Quetal(3, 9+3, -2, Hola(x+(3*3)));     
	int x,y,z;
	boolean XD = false;
}

`;
// prueba();
lexico.lexico(texto);
// lexico.printL();
sintactico(lexico.tokensBuenos);
printLn();
