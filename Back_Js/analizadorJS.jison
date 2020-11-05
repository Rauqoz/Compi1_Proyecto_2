/**
 * Analizador para JS
 */



%{
	//variables
	const nodo = require("./arbol");
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

	var tokensBuenos = [];
	var tokensMalos = [];
	var sintacticoBuenos = [];
	var sintacticoMalos = [];
	
%}

/* Definición Léxico */
%lex

%options case-insensitive

%%

\s+											//  espacios en blanco
"//"[\n]*									// comentario
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple


"true"				    { tokensBuenos.push( new token(yytext,"r_true",yylloc.first_line, yylloc.first_column)); return 'r_true';}
"false"				    { tokensBuenos.push( new token(yytext,"r_false",yylloc.first_line, yylloc.first_column)); return 'r_false';}
"int"				    { tokensBuenos.push( new token(yytext,"r_int",yylloc.first_line, yylloc.first_column)); return 'r_entero';}
"string"			    { tokensBuenos.push( new token(yytext,"r_string",yylloc.first_line, yylloc.first_column)); return 'r_string';}
"double"			    { tokensBuenos.push( new token(yytext,"r_double",yylloc.first_line, yylloc.first_column)); return 'r_double';}
"bool"				    { tokensBuenos.push( new token(yytext,"r_bool",yylloc.first_line, yylloc.first_column)); return 'r_bool';}
"char"				    { tokensBuenos.push( new token(yytext,"r_char",yylloc.first_line, yylloc.first_column)); return 'r_char';}
"while"				    { tokensBuenos.push( new token(yytext,"r_while",yylloc.first_line, yylloc.first_column)); return 'r_while';}
"do"				    { tokensBuenos.push( new token(yytext,"r_do",yylloc.first_line, yylloc.first_column)); return 'r_do';}
"if"				    { tokensBuenos.push( new token(yytext,"r_if",yylloc.first_line, yylloc.first_column)); return 'r_if';}
"else"				    { tokensBuenos.push( new token(yytext,"r_else",yylloc.first_line, yylloc.first_column)); return 'r_else';}
"for"			    	{ tokensBuenos.push( new token(yytext,"r_for",yylloc.first_line, yylloc.first_column)); return 'r_for';}
"switch"			    { tokensBuenos.push( new token(yytext,"r_switch",yylloc.first_line, yylloc.first_column)); return 'r_switch';}
"case"				    { tokensBuenos.push( new token(yytext,"r_case",yylloc.first_line, yylloc.first_column)); return 'r_case';}
"default"			    { tokensBuenos.push( new token(yytext,"r_default",yylloc.first_line, yylloc.first_column)); return 'r_default';}
"break"				    { tokensBuenos.push( new token(yytext,"r_break",yylloc.first_line, yylloc.first_column)); return 'r_break';}
"continue"			    { tokensBuenos.push( new token(yytext,"r_continue",yylloc.first_line, yylloc.first_column)); return 'r_continue';}
"return"			    { tokensBuenos.push( new token(yytext,"r_return",yylloc.first_line, yylloc.first_column)); return 'r_return';}
"public"                { tokensBuenos.push( new token(yytext,"r_public",yylloc.first_line, yylloc.first_column)); return 'r_public';}
"static"                { tokensBuenos.push( new token(yytext,"r_static",yylloc.first_line, yylloc.first_column)); return 'r_static';}
"void"			    	{ tokensBuenos.push( new token(yytext,"r_void",yylloc.first_line, yylloc.first_column)); return 'r_void';}
"main"				    { tokensBuenos.push( new token(yytext,"r_main",yylloc.first_line, yylloc.first_column)); return 'r_main';}
"args"				    { tokensBuenos.push( new token(yytext,"r_args",yylloc.first_line, yylloc.first_column)); return 'r_args';}
"class"				    { tokensBuenos.push( new token(yytext,"r_class",yylloc.first_line, yylloc.first_column)); return 'r_class';}
"interface"			    { tokensBuenos.push( new token(yytext,"r_interface",yylloc.first_line, yylloc.first_column)); return 'r_interface';}    
"system.out.print"	    { tokensBuenos.push( new token(yytext,"r_print",yylloc.first_line, yylloc.first_column)); return 'r_print';}
"system.out.println"	{ tokensBuenos.push( new token(yytext,"r_println",yylloc.first_line, yylloc.first_column)); return 'r_println';}

"{"					    { tokensBuenos.push( new token(yytext,"l_abrir",yylloc.first_line, yylloc.first_column)); return 'l_abrir';}
"}"					    { tokensBuenos.push( new token(yytext,"l_cerrar",yylloc.first_line, yylloc.first_column)); return 'l_cerrar';}
"("					    { tokensBuenos.push( new token(yytext,"p_abrir",yylloc.first_line, yylloc.first_column)); return 'p_abrir';}
")"					    { tokensBuenos.push( new token(yytext,"p_cerrar",yylloc.first_line, yylloc.first_column)); return 'p_cerrar';}
"["					    { tokensBuenos.push( new token(yytext,"c_abrir",yylloc.first_line, yylloc.first_column)); return 'c_abrir';}
"]"					    { tokensBuenos.push( new token(yytext,"c_cerrar",yylloc.first_line, yylloc.first_column)); return 'c_cerrar';}

"%"					    { tokensBuenos.push( new token(yytext,"r_modular",yylloc.first_line, yylloc.first_column)); return 'r_modular';}
"+"					    { tokensBuenos.push( new token(yytext,"r_mas",yylloc.first_line, yylloc.first_column)); return 'r_mas';}
"-"					    { tokensBuenos.push( new token(yytext,"r_menos",yylloc.first_line, yylloc.first_column)); return 'r_menos';}
"*"					    { tokensBuenos.push( new token(yytext,"r_asterisco",yylloc.first_line, yylloc.first_column)); return 'r_asterisco';}
"/"					    { tokensBuenos.push( new token(yytext,"r_diagonal",yylloc.first_line, yylloc.first_column)); return 'r_diagonal';}
"++"				    { tokensBuenos.push( new token(yytext,"r_masmas",yylloc.first_line, yylloc.first_column)); return 'r_masmas';}
"--"				    { tokensBuenos.push( new token(yytext,"r_menosmenos",yylloc.first_line, yylloc.first_column)); return 'r_menosmenos';}

"<"					    { tokensBuenos.push( new token(yytext,"r_menor",yylloc.first_line, yylloc.first_column)); return 'r_menor';}
">"					    { tokensBuenos.push( new token(yytext,"r_mayor",yylloc.first_line, yylloc.first_column)); return 'r_mayor';}
"="					    { tokensBuenos.push( new token(yytext,"r_igual",yylloc.first_line, yylloc.first_column)); return 'r_igual';}
"!"					    { tokensBuenos.push( new token(yytext,"r_not",yylloc.first_line, yylloc.first_column)); return 'r_not';}
"&&"				    { tokensBuenos.push( new token(yytext,"r_and",yylloc.first_line, yylloc.first_column)); return 'r_and'}
"||"				    { tokensBuenos.push( new token(yytext,"r_or",yylloc.first_line, yylloc.first_column)); return 'r_or';}
"^"					    { tokensBuenos.push( new token(yytext,"r_xor",yylloc.first_line, yylloc.first_column)); return 'r_xor';}
"<="				    { tokensBuenos.push( new token(yytext,"r_menorigual",yylloc.first_line, yylloc.first_column)); return 'r_menorigual';}
">="				    { tokensBuenos.push( new token(yytext,"r_mayorigual",yylloc.first_line, yylloc.first_column)); return 'r_mayorigual';}
"=="				    { tokensBuenos.push( new token(yytext,"r_igualigual",yylloc.first_line, yylloc.first_column)); return 'r_igualigual';}
"!="				    { tokensBuenos.push( new token(yytext,"r_notigual",yylloc.first_line, yylloc.first_column)); return 'r_notigual';}

","					    { tokensBuenos.push( new token(yytext,"r_coma",yylloc.first_line, yylloc.first_column)); return 'r_coma';}
":"					    { tokensBuenos.push( new token(yytext,"r_dospuntos",yylloc.first_line, yylloc.first_column)); return 'r_dospuntos';}
";"					    { tokensBuenos.push( new token(yytext,"r_puntocoma",yylloc.first_line, yylloc.first_column)); return 'r_puntocoma';}

\"(.)*\"                        {yytext = yytext.substr(1,yyleng-2); tokensBuenos.push( new token(yytext,"r_cadena",yylloc.first_line, yylloc.first_column)); return 'r_cadena';}
\'[a-zA-Z]\'                    {yytext = yytext.substr(1,yyleng-2); tokensBuenos.push( new token(yytext,"r_caracter",yylloc.first_line, yylloc.first_column)); return 'r_caracter';}
[0-9]+(\.[0-9]+)?\b             { tokensBuenos.push( new token(yytext,"r_numero",yylloc.first_line, yylloc.first_column)); return 'r_numero';}
[a-zA-Z]([a-zA-Z|0-9|_])*	    { tokensBuenos.push( new token(yytext,"r_id",yylloc.first_line, yylloc.first_column)); return 'r_id';}

<<EOF>>				    return 'EOF';

.					    {console.log("Error lexico: " + yytext + " Linea: " + yylloc.first_line + " Columna:  " + yylloc.first_column); tokensMalos.push(new errorToken(yytext,yylloc.first_line, yylloc.first_column));}

/lex

/* Precedencia */
%left r_mas r_menos
%left r_asterisco r_diagonal
%left p_abrir p_cerrar
%left UMENOS 

%start start
%% /* Gramática */

start:	lista EOF {
	$$ =  new nodo("start","");
	$$.pushHijo($1);
	raizA = $$;
	var data = {
		raiz:raizA,
		lexicoB: tokensBuenos,
		lexicoM: tokensMalos,
		sintacticoB: sintacticoBuenos,
		sintacticoM: sintacticoMalos
	};
	tokensBuenos = [];
	tokensMalos = [];
	sintacticoBuenos = [];
	sintacticoMalos = [];
	return data;
}
;

lista:	r_public principal lista 
	|	
;

principal:	r_class r_id l_abrir lmetodos l_cerrar 
	|	r_interface r_id l_abrir definiciones l_cerrar 
;

lmetodos:	r_public metodos lmetodos 
	|	declaracion lmetodos 
	|	
;

metodos:	r_static r_void r_main p_abrir r_string c_abrir c_cerrar r_args p_cerrar l_abrir linstrucciones l_cerrar 
	|	r_void r_id p_abrir lparametros p_cerrar l_abrir linstrucciones l_cerrar 
	|	ltipos r_id p_abrir lparametros p_cerrar l_abrir linstrucciones l_cerrar
;

lparametros:	ltipos r_id parametros
	|	
;

parametros:	r_coma ltipos r_id parametros
	|	
;

ltipos:		r_int
	|	r_double
	|	r_string
	|	r_char
	|	r_bool
;

linstrucciones:		declaracion linstrucciones
	|	r_id seleccionid linstrucciones
	|	r_return lreturn linstrucciones
	|	r_continue r_puntocoma linstrucciones
	|	r_break r_puntocoma linstrucciones
	|	prints linstrucciones
	|	mif linstrucciones
	|	mfor linstrucciones
	|	mwhile linstrucciones
	|	mdo linstrucciones
	|	
;

declaracion: ltipos r_id ldeclaracion r_puntocoma
;

ldeclaracion:	r_coma r_id ldeclaracion
	|	r_igual lexpresion mdeclaracion
	|	
;

mdeclaracion:	r_coma r_id ldeclaracion
	|	
;

lexpresion:	r_mas expresion
	|	r_menos expresion
	|	expresion
;

expresion:	r_numero operacion
	|	r_cadena operacion
	|	r_caracter operacion
	|	booleano operacion
	|	r_id emetodo operacion
	|	p_abrir lexpresion p_cerrar operacion
	|	r_not expresion operacion
;

operacion:	r_mas expresion
	|	r_menos expresion
	|	r_asterisco expresion
	|	r_diagonal expresion
	|	r_masmas operacion
	|	r_menosmenos operacion
	|	r_menor expresion
	|	r_mayor expresion
	|	r_mayorigual expresion
	|	r_menorigual expresion
	|	r_igualigual expresion
	|	r_notigual expresion
	|	r_and expresion
	|	r_or expresion
	|	r_xor expresion
	|	
;

booleano:	r_true
	|	r_false
;

emetodo:	p_abrir lvalores p_cerrar
	|	
;

lvalores:	expresion valores
	|	
;

valores:	r_coma lexpresion valores
	|	
;

seleccionid: 	p_abrir lvalores p_cerrar r_puntocoma
	|	r_igual lexpresion r_puntocoma
	|	r_masmas r_puntocoma
	|	r_menosmenos r_puntocoma
;

lreturn: 	lexpresion r_puntocoma
	|	r_puntocoma
;

prints:		r_fprint p_abrir lexpresion p_cerrar r_puntocoma
	|	r_fprintln p_abrir lexpresion p_cerrar r_puntocoma
;

mif:		r_if p_abrir lexpresion p_cerrar l_abrir linstrucciones l_cerrar lif
;

lif:		r_else melse
	|	
;

melse:		r_if p_abrir lexpresion p_cerrar l_abrir linstrucciones l_cerrar lif
	|	l_abrir linstrucciones l_cerrar lif
;

mfor:		r_for p_abrir declaracion lexpresion r_puntocoma lexpresion p_cerrar l_abrir linstrucciones l_cerrar
;

mwhile:		r_while p_abrir lexpresion p_cerrar l_abrir linstrucciones l_cerrar 
;

mdo:		r_do l_abrir linstrucciones l_cerrar r_while p_abrir lexpresion p_cerrar r_puntocoma
;

definiciones:	declaracion definiciones
	|	r_public lmetodosdefiniciones
	|	
;

lmetodosdefiniciones:	r_public metodosdefiniciones lmetodosdefiniciones
	|	declaracion lmetodosdefiniciones
	|	
;

metodosdefiniciones:	r_void r_id p_abrir lparametros p_cerrar r_puntocoma
	|	ltipos r_id p_abrir lparametros p_cerrar r_puntocoma
;