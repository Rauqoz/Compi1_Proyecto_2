/**
 * Analizador para JS
 */



%{
	//variables
    eLexicos = []
	
%}

/* Definición Léxico */
%lex

%options case-insensitive

%%

\s+											//  espacios en blanco
"//"[\n]*									// comentario
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple


"true"				    return 'r_true';
"false"				    return 'r_false';
"int"				    return 'r_entero';
"string"			    return 'r_string';
"double"			    return 'r_double';
"bool"				    return 'r_bool';
"char"				    return 'r_char';
"while"				    return 'r_while';
"do"				    return 'r_do';
"if"				    return 'r_if';
"else"				    return 'r_else';
"for"			    	return 'r_for';
"switch"			    return 'r_switch';
"case"				    return 'r_case';
"default"			    return 'r_default';
"break"				    return 'r_break';
"continue"			    return 'r_continue';
"return"			    return 'r_return';
"public"                return 'r_public';
"static"                return 'r_static';
"void"			    	return 'r_void';
"main"				    return 'r_main';
"args"				    return 'r_args';
"class"				    return 'r_class';
"interface"			    return 'r_interface';
"system"			    return 'r_system';
"out"				    return 'r_out';
"print"				    return 'r_print';
"println"			    return 'r_println';
"system.out.print"	    return 'r_fprint';
"system.out.println"	return 'r_fprintln';

"{"					    return 'l_abrir';
"}"					    return 'l_cerrar';
"("					    return 'p_abrir';
")"					    return 'p_cerrar';
"["					    return 'c_abrir';
"]"					    return 'c_cerrar';

"%"					    return 'r_modular';
"+"					    return 'r_mas';
"-"					    return 'r_menos';
"*"					    return 'r_asterisco';
"/"					    return 'r_diagonal';
"++"				    return 'r_masmas';
"--"				    return 'r_menosmenos';

"<"					    return 'r_menor';
">"					    return 'r_mayor';
"="					    return 'r_igual';
"!"					    return 'r_not';
"&&"				    return 'r_and'
"||"				    return 'r_or';
"^"					    return 'r_xor';
"<="				    return 'r_menorigual';
">="				    return 'r_mayorigual';
"=="				    return 'r_igualigual';
"!="				    return 'r_notigual';

","					    return 'r_coma';
":"					    return 'r_dospuntos';
";"					    return 'r_puntocoma';

\"(.)*\"                        {yytext = yytext.substr(1,yyleng-2);return 'r_cadena';}
\'[a-zA-Z]\'                    {yytext = yytext.substr(1,yyleng-2);return 'r_caracter';}
[0-9]+(\.[0-9]+)?\b             return 'r_numero';
[a-zA-Z]([a-zA-Z|0-9|_])*	    return 'r_id';

<<EOF>>				    return 'EOF';

.					    {console.log("Error lexico: " + yytext + " Linea: " + yylloc.first_line + " Columna:  " + yylloc.first_column)}

/lex


/* Precedencia */
%left r_mas r_menos
%left r_asterisco r_diagonal
%left p_abrir p_cerrar
%left UMENOS 

%start start
%% /* Gramática */

start:	principal EOF
;

//class , interface
principal:	r_public tprincipal
;

tprincipal:	r_class r_id l_abrir secundario l_cerrar
	|	r_interface r_id l_abrir definiciones l_cerrar
;

definiciones:	r_void r_id p_abrir parametros p_cerrar l_abrir todo l_cerrar definiciones
	|	tipo r_id p_abrir parametros p_cerrar l_abrir todo l_cerrar definiciones
	|	
;

//main , variables , metodo
secundario:	r_public main secundario
	|	r_int r_id asnumero mdnumero r_puntocoma secundario
	|	r_string r_id ascadena mdcadena r_puntocoma secundario
	|	r_double r_id asnumero mdnumero r_puntocoma secundario
	|	r_bool r_id asbool mdbool r_puntocoma secundario
	|	r_char r_id aschar mdchar r_puntocoma secundario
	|	
;

main:		r_static r_void r_main p_abrir r_string c_abrir c_cerrar r_args p_cerrar l_abrir todo l_cerrar
	|	metodos
;

metodos:	r_void r_id p_abrir parametros p_cerrar l_abrir todo l_cerrar
	|	tipo r_id p_abrir parametros p_cerrar l_abrir todoreturn l_cerrar
;

tipo:		r_int
	|	r_string
	|	r_double
	|	r_bool
	|	r_char
;

parametros:	tipo r_id mparametros
	|	
;

mparametros:	r_coma tipo r_id mparametros
	|	
;

//todo lo de adentro de una funcion
todoreturn:	r_int r_id asnumero mdnumero r_puntocoma todoreturn
	|	r_string r_id ascadena mdcadena r_puntocoma todoreturn
	|	r_double r_id asnumero mdnumero r_puntocoma todoreturn
	|	r_bool r_id asbool mdbool r_puntocoma todoreturn
	|	r_char r_id aschar mdchar r_puntocoma todoreturn
	|	r_if mif todoreturn
	|	r_for mfor todoreturn
	|	r_while mwhile todoreturn
	|	r_do mdowhile todoreturn
	|	r_return todoreturn
	|	
;

//todo lo adentro de un metodo
todo:		r_int r_id asnumero mdnumero r_puntocoma todo
	|	r_string r_id ascadena mdcadena r_puntocoma todo
	|	r_double r_id asnumero mdnumero r_puntocoma todo
	|	r_bool r_id asbool mdbool r_puntocoma todo
	|	r_char r_id aschar mdchar r_puntocoma todo
	|	r_if mif todo
	|	r_for mfor todo
	|	r_while mwhile todo
	|	r_do mdowhile todo
	|	
;

//todo lo de adentro de un ciclo
todobreak:	r_int r_id asnumero mdnumero r_puntocoma todobreak
	|	r_string r_id ascadena mdcadena r_puntocoma todobreak
	|	r_double r_id asnumero mdnumero r_puntocoma todobreak
	|	r_bool r_id asbool mdbool r_puntocoma todobreak
	|	r_char r_id aschar mdchar r_puntocoma todobreak
	|	r_if mif todobreak
	|	r_for mfor todobreak
	|	r_while mwhile todobreak
	|	r_do mdowhile todobreak
	|	r_break todobreak
	|	r_continue todobreak
	|	
;

//metodo if
mif:		p_abrir expresion p_cerrar l_abrir todo l_cerrar melseif melse
;

melseif:	r_else r_if p_abrir expresion p_cerrar l_abrir todo l_cerrar melseif 
	|	
;

melse:		r_else l_abrir todo l_cerrar
	|	
;

//metodo for
mfor:		p_abrir expresionfor p_cerrar l_abrir todobreak l_cerrar
;

//metodo while
mwhile:		p_abrir expresion p_cerrar l_abrir todobreak l_cerrar
;

//metodo do while
mdowhile:	l_abrir todobreak l_cerrar r_while p_abrir expresion p_cerrar r_puntocoma
;

//expresion do, while, if
expresion:	r_id emetodo opexpre
	|	r_numero opexprenumero
	|	r_true	
	|	r_false
	|	r_cadena opexpretexto
	|	r_caracter opexpretexto
;
opexprenumero:	r_mayor topexprenumero logicanumero
	|	r_menor topexprenumero logicanumero
	|	r_mayorigual topexprenumero logicanumero
	|	r_menorigual topexprenumero logicanumero
	|	r_igualigual topexprenumero logicanumero
	|	r_notigual topexprenumero logicanumero
;

topexprenumero:	r_numero
	|	r_id emetodo
;

logicanumero:	r_and topexprenumero opexprenumero logicanumero
	|	r_or topexprenumero opexprenumero logicanumero
	|	r_xor topexprenumero opexprenumero logicanumero
	|	
;

opexpretexto:	r_igualigual topexpretexto logicatexto
	|	r_notigual topexpretexto logicatexto
;

topexpretexto:	r_cadena
	|	r_caracter
	|	r_id emetodo
;

logicatexto: 	r_and topexpretexto opexpretexto logicatexto
	|	r_or topexpretexto  opexpretexto logicatexto
	|	r_xor topexpretexto opexpretexto logicatexto
	|	
;

opexpre:	r_mayor topexpreid logicaid
	|	r_menor topexpreid logicaid
	|	r_mayorigual topexpreid logicaid
	|	r_menorigual topexpreid logicaid
	|	r_igualigual topexpreid logicaid
	|	r_notigual topexpreid logicaid
;

topexpreid:	r_cadena
	|	r_caracter
	|	r_id emetodo
	|	r_true
	|	r_false
	|	r_numero
;

logicaid:	r_and topexpreid opexpre logicaid
	|	r_or topexpreid opexpre logicaid
	|	r_xor topexpreid opexpre logicaid
	|	
;

//expresion for
expresionfor:	tipo r_id r_igual r_numero r_puntocoma r_id logicafor r_puntocoma r_id adicion
;

logicafor:	r_mayor topexprefor 
	|	r_menor topexprefor 
	|	r_mayorigual topexprefor 
	|	r_menorigual topexprefor 
	|	r_igualigual topexprefor 
	|	r_notigual topexprefor 
;

topexprefor:	r_id emetodo opfor
	|	r_numero opfor
	|	p_abrir topexprefor p_cerrar opfor
;

opfor:		r_mas topexprefor opfor
	|	r_menos topexprefor opfor
	|	r_asterisco topexprefor opfor
	|	r_diagonal topexprefor opfor
	|	
;


//asignacion numeros
asnumero:	r_igual masnumero
	|	
;

masnumero:	r_numero opnumero
	|	r_id emetodo opnumero
	|	r_menos r_mumero opnumero %prec UMENOS
	|	p_abrir masnumero p_cerrar opnumero
;

emetodo:	p_abrir p_cerrar
	|	
;

opnumero:	r_mas opnumeropar masnumero
	|	r_menos opnumeropar masnumero
	|	r_asterisco opnumeropar masnumero
	|	r_diagonal opnumeropar masnumero
	|	
;

opnumeropar:	p_abrir masnumero p_cerrar
	|	
;

mdnumero:	p_coma r_id asnumero mdnumero
	|	
;

//asignacion cadenas
ascadena:	r_igual mascadena
	|	
;

mascadena:	r_cadena opcadena
	|	r_id p_abrir p_cerrar opcadena
;

opcadena:	r_mas mascadena
	|	
;

mdcadena:	p_coma r_id ascadena mdcadena
	|	
;

//asignacion booleanos
asbool:		r_igual masbool
	|	
;

masbool:	r_true opbool
	|	r_false opbool
	|	r_id p_abrir p_cerrar opbool
;

opbool:		r_and masbool
	|	r_or masbool
	|	r_xor masbool
	|	
;

mdbool:		p_coma r_id asbool mdbool
	|	
;

//asignacion caracteres
aschar:		r_igual maschar
	|	
;

maschar:	r_caracter
	|	r_id p_abrir p_cerrar
;

mdchar:		p_coma r_id aschar mdchar
	|	
;