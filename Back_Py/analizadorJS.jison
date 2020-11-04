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

start:	lista
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