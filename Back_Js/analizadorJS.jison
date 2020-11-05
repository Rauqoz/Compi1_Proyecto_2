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

	class errorSintactico {
		constructor(palabra,esperado, fila, columna) {
		this.palabra = palabra;
		this.esperado = esperado;
		this.fila = fila;
		this.columna = columna;
		}
	}

	var tokensBuenos = new Array();
	var tokensMalos = new Array();
	var sintacticoBuenos = new Array();
	var sintacticoMalos = new Array();
	
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
"int"				    { tokensBuenos.push( new token(yytext,"r_int",yylloc.first_line, yylloc.first_column)); return 'r_int';}
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

start:	lista {
	$$ =  new nodo("","start");
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

lista:	r_public principal lista {
	$$ = new nodo("","lista");
	$$.pushHijo("","r_public");
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	error l_cerrar lista {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","lista");
			$$.pushHijo("","Error");
			$$.pushHijo($3);
			sintacticoMalos.push(new errorSintactico($1,"error en lista",this._$.first_line,this._$.first_column));
	}
	| EOF {
		$$ = new nodo("","lista");
	}
;

principal:	r_class r_id l_abrir lmetodos {
	$$ = new nodo("","principal");
	$$.pushHijo(new nodo("class","r_class"));
	$$.pushHijo(new nodo($2,"r_id"));
	$$.pushHijo(new nodo($3,"l_abrir"));
	$$.pushHijo($4);
}
	|	r_interface r_id l_abrir lmetodosdefiniciones {
		$$ = new nodo("","principal");
		$$.pushHijo( new nodo( "", "r_interface"));
		$$.pushHijo(new nodo("","r_id"));
		$$.pushHijo(new nodo("","l_abrir"));
		$$.pushHijo($4);
	}
	| error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","principal");
			$$.pushHijo("","Error");
			sintacticoMalos.push(new errorSintactico($1,"error en principal",this._$.first_line,this._$.first_column));
	}
;

lmetodosdefiniciones:	 r_public metodosdefiniciones lmetodosdefiniciones {
	$$ = new nodo("","lmetodosdefiniciones");
	$$.pushHijo(new nodo("","r_public"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	  ltipos declaracion lmetodosdefiniciones{
	$$ = new nodo("","lmetodosdefiniciones");
	$$.pushHijo($1);
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	| l_cerrar	{
		$$ = new nodo("","lmetodosdefiniciones");
		$$.pushHijo(new nodo($1,"l_cerrar"));
}
	| error recmetodos lmetodosdefiniciones{
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","lmetodosdefiniciones");
			$$.pushHijo("","Error");
			$$.pushHijo($3);
			sintacticoMalos.push(new errorSintactico($1,"error en lmetodosdefiniciones",this._$.first_line,this._$.first_column));
	}
;

metodosdefiniciones:	r_void r_id p_abrir lparametros r_puntocoma {
	$$ = new nodo("","metodosdefiniciones");
	$$.pushHijo(new nodo("","r_void"));
	$$.pushHijo(new nodo("","r_id"));
	$$.pushHijo(new nodo("","p_abrir"));
	$$.pushHijo($4);
	$$.pushHijo(new nodo("","r_puntocoma"));
}
	|	ltipos r_id p_abrir lparametros r_puntocoma {
	$$ = new nodo("","metodosdefiniciones");
	$$.pushHijo($1);
	$$.pushHijo(new nodo("","r_id"));
	$$.pushHijo(new nodo("","p_abrir"));
	$$.pushHijo($4);
	$$.pushHijo(new nodo("","r_puntocoma"));
}
	| error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","metodosdefiniciones");
			$$.pushHijo("","Error");
			sintacticoMalos.push(new errorSintactico($1,"error en metodosdefiniciones",this._$.first_line,this._$.first_column));
	}
;

lmetodos:	 r_public metodos  lmetodos{
	$$ = new nodo("","lmetodos");
	$$.pushHijo(new nodo("","r_public"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	ltipos declaracion  lmetodos{
		$$ = new nodo("","lmetodos");
		$$.pushHijo($1);
		$$.pushHijo($2);
		$$.pushHijo($3);
		console.log("entro a tipos");
	}
	| l_cerrar	{
		$$ = new nodo("","lmetodos");
		$$.pushHijo(new nodo($1,"l_cerrar"));
	}
	| error recmetodos lmetodos{
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","lmetodos");
			$$.pushHijo("","Error");
			$$.pushHijo($3);
			sintacticoMalos.push(new errorSintactico($1,"error en lmetodos",this._$.first_line,this._$.first_column));
	}
;

recmetodos: l_cerrar {$$ = new nodo("","recmetodos");}
	|	r_puntocoma {$$ = new nodo("","recmetodos");}
;

metodos:	r_static r_void r_main p_abrir r_string c_abrir c_cerrar r_args p_cerrar l_abrir linstrucciones  {
	$$ = new nodo("","metodos");
	$$.pushHijo(new nodo("","r_static"));
	$$.pushHijo(new nodo("function","r_void"));
	$$.pushHijo(new nodo("main","r_main"));
	$$.pushHijo(new nodo($4,"p_abrir"));
	$$.pushHijo(new nodo("","r_string"));
	$$.pushHijo(new nodo("","c_abrir"));
	$$.pushHijo(new nodo("","c_cerrar"));
	$$.pushHijo(new nodo("","r_args"));
	$$.pushHijo(new nodo($9,"p_cerrar"));
	$$.pushHijo(new nodo($10,"l_abrir"));
	$$.pushHijo($11);
}
	|	r_void r_id p_abrir lparametros p_cerrar l_abrir linstrucciones  {
		$$ = new nodo("","metodos");
		$$.pushHijo(new nodo("function","r_void"));
		$$.pushHijo(new nodo($2,"r_id"));
		$$.pushHijo(new nodo($3,"p_abrir"));
		$$.pushHijo($4);
		$$.pushHijo(new nodo($5,"p_cerrar"));
		$$.pushHijo(new nodo($6,"l_abrir"));
		$$.pushHijo($7);
	}
	|	ltipos r_id p_abrir lparametros p_cerrar l_abrir linstrucciones {
		$$ = new nodo("","metodos");
		$$.pushHijo($1);
		$$.nodos[0].nodos[0].tTraducido = "function";
		$$.pushHijo(new nodo($2,"r_id"));
		$$.pushHijo(new nodo($3,"p_abrir"));
		$$.pushHijo($4);
		$$.pushHijo(new nodo($5,"p_cerrar"));
		$$.pushHijo(new nodo($6,"l_abrir"));
		$$.pushHijo($7);
	}
	| error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","metodos");
			$$.pushHijo("","Error");
			sintacticoMalos.push(new errorSintactico($1,"error en metodos",this._$.first_line,this._$.first_column));
	}
;

lparametros:	ltipos r_id parametros {
	$$ = new nodo("","lparametros");
	$$.pushHijo($1);
	$$.nodos[0].nodos[0].tTraducido = "";
	$$.pushHijo(new nodo($2,"r_id"));
	$$.pushHijo($3);
}
	|  {
		$$ = new nodo("","lparametros");
	}
;

parametros:	 r_coma ltipos r_id parametros{
	$$ = new nodo("","parametros");
	$$.pushHijo(new nodo($1,"r_coma"));
	$$.pushHijo($2);
	$$.nodos[1].tTraducido = "";
	$$.pushHijo(new nodo($3,"r_id"));
	$$.pushHijo($4);

}
	| 	{
		$$ = new nodo("","parametros");
	}
;

ltipos:		r_int {
		$$ = new nodo("","ltipos");
		$$.pushHijo(new nodo("var ","r_int"));
		console.log("es int");

}
	|	r_double {
		$$ = new nodo("","ltipos");
		$$.pushHijo(new nodo("var ","r_double"));

}
	|	r_string {
		$$ = new nodo("","ltipos");
		$$.pushHijo(new nodo("var ","r_string"));

}
	|	r_char {
		$$ = new nodo("","ltipos");
		$$.pushHijo(new nodo("var ","r_char"));

}
	|	r_bool {
		$$ = new nodo("","ltipos");
		$$.pushHijo(new nodo("var ","r_bool"));

}
	| error  { //podria ser l_cerrar
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","ltipos");
			$$.pushHijo("","Error");
			sintacticoMalos.push(new errorSintactico($1,"error en ltipos",this._$.first_line,this._$.first_column));
	}
;

linstrucciones:	 ltipos declaracion linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo($1);
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	 r_id seleccionid linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_id"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	 r_return lreturn linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_return"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	 r_continue r_puntocoma linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_continue"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
	$$.pushHijo($3);
}
	|	 r_break r_puntocoma linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_break"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
	$$.pushHijo($3);
}
	|	 prints linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo($1);
	$$.pushHijo($2);
}
	|	 r_if mif linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_if"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	 r_for mfor linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_for"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	 r_while mwhile linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_while"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	 r_do mdo linstrucciones{
	$$ = new nodo("","linstrucciones");
	$$.pushHijo(new nodo($1,"r_do"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	l_cerrar {
		$$ = new nodo("","linstrucciones");
		$$.pushHijo(new nodo($1,"l_cerrar"));
	}
	|	error reclinstrucciones  {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","linstrucciones");
			$$.pushHijo("","Error");
			$$.pushHijo(new nodo($2,"reclinstrucciones"));
			sintacticoMalos.push(new errorSintactico($1,"error en linstrucciones",this._$.first_line,this._$.first_column));
	}
;

reclinstrucciones: l_cerrar {
	$$ = new nodo($1,"l_cerrar");
}
	|	r_puntocoma linstrucciones{
		$$ =$2;
}
;


declaracion:  r_id ldeclaracion r_puntocoma {
	$$ = new nodo("","declaracion");
	$$.pushHijo(new nodo($1,"r_id"));
	$$.pushHijo($2);
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	| error r_puntocoma {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

            $$ = new nodo("","declaracion");
			$$.pushHijo("","Error");
			sintacticoMalos.push(new errorSintactico($1,"error en declaracion",this._$.first_line,this._$.first_column));
	}
;

ldeclaracion:	r_coma r_id ldeclaracion {
	$$ = new nodo("","ldeclaracion");
	$$.pushHijo(new nodo($1,"r_coma"));
	$$.pushHijo(new nodo($2,"r_id"));
	$$.pushHijo($3);
}
	|	r_igual lexpresion mdeclaracion {
	$$ = new nodo("","ldeclaracion");
	$$.pushHijo(new nodo($1,"r_igual"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	{$$ = new nodo("","ldeclaracion");}
;

mdeclaracion:	r_coma r_id ldeclaracion {
	$$ = new nodo("","mdeclaracion");
	$$.pushHijo(new nodo($1,"r_coma"));
	$$.pushHijo(new nodo($2,"r_id"));
	$$.pushHijo($3);
}
	|	{$$ = new nodo("","mdeclaracion");}
;

lexpresion:	r_mas expresion {
	$$ = new nodo("","lexpresion");
	$$.pushHijo(new nodo($1,"r_mas"));
	$$.pushHijo($2);
}
	|	r_menos expresion {
	$$ = new nodo("","lexpresion");
	$$.pushHijo(new nodo($1,"r_menos"));
	$$.pushHijo($2);
}
	|	expresion {
		$$ = new nodo("","lexpresion");
		$$.pushHijo($1);
	}
;

expresion:	r_numero operacion {
	$$ = new nodo("","expresion");
	$$.pushHijo(new nodo($1,"r_numero"));
	$$.pushHijo($2);
}
	|	r_cadena operacion {
	$$ = new nodo("","expresion");
	$$.pushHijo(new nodo($1,"r_cadena"));
	$$.pushHijo($2);
}
	|	r_caracter operacion {
	$$ = new nodo("","expresion");
	$$.pushHijo(new nodo($1,"r_caracter"));
	$$.pushHijo($2);
}
	|	booleano operacion {
	$$ = new nodo("","expresion");
	$$.pushHijo($1);
	$$.pushHijo($2);
}
	|	r_id emetodo operacion {
	$$ = new nodo("","expresion");
	$$.pushHijo(new nodo($1,"r_id"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	p_abrir lexpresion p_cerrar operacion {
	$$ = new nodo("","expresion");
	$$.pushHijo(new nodo($1,"p_abrir"));
	$$.pushHijo($2);
	$$.pushHijo(new nodo($3,"p_cerrar"));
	$$.pushHijo($4);
}
	|	r_not expresion {
	$$ = new nodo("","expresion");
	$$.pushHijo(new nodo($1,"r_not"));
	$$.pushHijo($2);
	}
	/* |	error recexpresion {
			console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

			$$ = new nodo("","expresion");
			$$.pushHijo("","Error");
			sintacticoMalos.push(new errorSintactico($1,"error en expresion",this._$.first_line,this._$.first_column));
	} */
;

recexpresion: r_puntocoma {
	$$ = new nodo("","recexpresion");
}
	|	p_cerrar {
	$$ = new nodo("","recexpresion");
}
;

operacion:	r_mas expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_mas"));
	$$.pushHijo($2);
}
	|	r_menos expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_menos"));
	$$.pushHijo($2);
}
	|	r_asterisco expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_asterisco"));
	$$.pushHijo($2);
}
	|	r_diagonal expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_diagonal"));
	$$.pushHijo($2);
}
	|	r_masmas operacion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_masmas"));
	$$.pushHijo($2);
}
	|	r_menosmenos operacion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_menosmenos"));
	$$.pushHijo($2);
}
	|	r_menor expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_menor"));
	$$.pushHijo($2);
}
	|	r_mayor expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_mayor"));
	$$.pushHijo($2);
}
	|	r_mayorigual expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_mayorigual"));
	$$.pushHijo($2);
}
	|	r_menorigual expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_menorigual"));
	$$.pushHijo($2);
}
	|	r_igualigual expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_igualigual"));
	$$.pushHijo($2);
}
	|	r_notigual expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_notigual"));
	$$.pushHijo($2);
}
	|	r_and expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_and"));
	$$.pushHijo($2);
}
	|	r_or expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_or"));
	$$.pushHijo($2);
}
	|	r_xor expresion {
	$$ = new nodo("","operacion");
	$$.pushHijo(new nodo($1,"r_xor"));
	$$.pushHijo($2);
}
	|	{
	$$ = new nodo("","operacion");
}
;

booleano:	r_true {
	$$ = new nodo("","booleano");
	$$.pushHijo(new nodo($1,"r_true"));
}
	|	r_false {
	$$ = new nodo("","booleano");
	$$.pushHijo(new nodo($1,"r_false"));
}
;

emetodo:	p_abrir lvalores p_cerrar {
	$$ = new nodo("","emetodo");
	$$.pushHijo(new nodo($1,"p_abrir"));
	$$.pushHijo($2);
	$$.pushHijo(new nodo($3,"p_cerrar"));
}
	|	{
		$$ = new nodo("","emetodo");
	}
;

lvalores:	expresion valores {
	$$ = new nodo("","lvalores");
	$$.pushHijo($1);
	$$.pushHijo($2);
}
	|	{
		$$ = new nodo("","lvalores");
	}
;

valores:	r_coma lexpresion valores {
	$$ = new nodo("","valores");
	$$.pushHijo(new nodo($1,"r_coma"));
	$$.pushHijo($2);
	$$.pushHijo($3);
}
	|	{
		$$ = new nodo("","valores");
	}
;

seleccionid: 	p_abrir lvalores p_cerrar r_puntocoma {
	$$ = new nodo("","seleccionid");
	$$.pushHijo(new nodo($1,"p_abrir"));
	$$.pushHijo($2);
	$$.pushHijo(new nodo($3,"p_cerrar"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	|	r_igual lexpresion r_puntocoma {
	$$ = new nodo("","seleccionid");
	$$.pushHijo(new nodo($1,"r_igual"));
	$$.pushHijo($2);
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	|	r_masmas r_puntocoma {
	$$ = new nodo("","seleccionid");
	$$.pushHijo(new nodo($1,"r_masmas"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	|	r_menosmenos r_puntocoma {
	$$ = new nodo("","seleccionid");
	$$.pushHijo(new nodo($1,"r_menosmenos"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	|	error r_puntocoma {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

		$$ = new nodo("","seleccionid");
		$$.pushHijo("","Error");
		sintacticoMalos.push(new errorSintactico($1,"error en seleccionid",this._$.first_line,this._$.first_column));
	}
;

lreturn: 	lexpresion r_puntocoma {
	$$ = new nodo("","lreturn");
	$$.pushHijo($1);
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	|	r_puntocoma {
	$$ = new nodo("","lreturn");
	$$.pushHijo(new nodo("\n","r_puntocoma"));
	}
;

prints:		r_fprint p_abrir lexpresion p_cerrar r_puntocoma {
	$$ =  new nodo("","prints");
	$$.pushHijo(new nodo("console.log","r_fprint"));
	$$.pushHijo(new nodo($2,"p_abrir"));
	$$.pushHijo($3);
	$$.pushHijo(new nodo($4,"p_cerrar"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
	|	r_fprintln p_abrir lexpresion p_cerrar r_puntocoma {
	$$ =  new nodo("","prints");
	$$.pushHijo(new nodo("console.log","r_fprintln"));
	$$.pushHijo(new nodo($2,"p_abrir"));
	$$.pushHijo($3);
	$$.pushHijo(new nodo($4,"p_cerrar"));
	$$.pushHijo(new nodo("\n","r_puntocoma"));
}
;

mif:	p_abrir lexpresion p_cerrar l_abrir linstrucciones l_cerrar lif {
	$$ = new nodo("","mif");
	$$.pushHijo(new nodo($1,"p_abrir"));
	$$.pushHijo($2);
	$$.pushHijo(new nodo($3,"p_cerrar"));
	$$.pushHijo(new nodo($4,"l_abrir"));
	$$.pushHijo($5);
	$$.pushHijo(new nodo($6,"l_cerrar"));
	$$.pushHijo($7);
}
	|	error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

		$$ = new nodo("","mif");
		$$.pushHijo("","Error");
		sintacticoMalos.push(new errorSintactico($1,"error en mif",this._$.first_line,this._$.first_column));
	}
;

lif:		r_else melse {
	$$ = new nodo("","lif");
	$$.pushHijo(new nodo($1,"r_else"));
	$$.pushHijo($2);
}
	|	{
	$$ = new nodo("","lif");
	}
;

melse:		r_if p_abrir lexpresion p_cerrar l_abrir linstrucciones l_cerrar lif {
	$$ = new nodo("","melse");
	$$.pushHijo(new nodo($1,"r_if"));
	$$.pushHijo(new nodo($2,"p_abrir"));
	$$.pushHijo($3);
	$$.pushHijo(new nodo($4,"p_cerrar"));
	$$.pushHijo(new nodo($5,"l_abrir"));
	$$.pushHijo($6);
	$$.pushHijo(new nodo($7,"l_cerrar"));
	$$.pushHijo($8);
}
	|	l_abrir linstrucciones l_cerrar lif {
		$$ = new nodo("","melse");
		$$.pushHijo(new nodo($1,"l_abrir"));
		$$.pushHijo($2);
		$$.pushHijo(new nodo($3,"l_cerrar"));
		$$.pushHijo($4);
	}
	|	error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

		$$ = new nodo("","melse");
		$$.pushHijo("","Error");
		sintacticoMalos.push(new errorSintactico($1,"error en melse",this._$.first_line,this._$.first_column));
	}
;

mfor:		r_for p_abrir ltipos declaracion lexpresion r_puntocoma lexpresion p_cerrar l_abrir linstrucciones l_cerrar {
	$$ = new nodo("","mfor");
	$$.pushHijo(new nodo($1,"r_for"));
	$$.pushHijo(new nodo($2,"p_abrir"));
	$$.pushHijo($3);
	$$.pushHijo($4);
	$$.nodos[3].nodos[2].tTraducido = ";";
	$$.pushHijo($5);
	$$.pushHijo(new nodo($6,"r_puntocoma"));
	$$.pushHijo($7);
	$$.pushHijo(new nodo($8,"p_cerrar"));
	$$.pushHijo(new nodo($9,"l_abrir"));
	$$.pushHijo($10);
	$$.pushHijo(new nodo($11,"l_cerrar"));
}
	|	error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

		$$ = new nodo("","mfor");
		$$.pushHijo("","Error");
		sintacticoMalos.push(new errorSintactico($1,"error en mfor",this._$.first_line,this._$.first_column));
	}
;

mwhile:		r_while p_abrir lexpresion p_cerrar l_abrir linstrucciones l_cerrar {
	$$ = new nodo("","mwhile");
	$$.pushHijo(new nodo($1,"r_while"));
	$$.pushHijo(new nodo($2,"p_abrir"));
	$$.pushHijo($3);
	$$.pushHijo(new nodo($4,"p_cerrar"));
	$$.pushHijo(new nodo($5,"l_abrir"));
	$$.pushHijo($6);
	$$.pushHijo(new nodo($7,"l_cerrar"));
}
|	error l_cerrar {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

		$$ = new nodo("","mwhile");
		$$.pushHijo("","Error");
		sintacticoMalos.push(new errorSintactico($1,"error en mwhile",this._$.first_line,this._$.first_column));
	}
;

mdo:		r_do l_abrir linstrucciones l_cerrar r_while p_abrir lexpresion p_cerrar r_puntocoma {
	$$ = new nodo("","mdo");
	$$.pushHijo(new nodo($1,"r_do"));
	$$.pushHijo(new nodo($2,"l_abrir"));
	$$.pushHijo($3);
	$$.pushHijo(new nodo($2,"l_cerrar"));
	$$.pushHijo(new nodo($4,"r_while"));
	$$.pushHijo(new nodo($5,"p_abrir"));
	$$.pushHijo($6);
	$$.pushHijo(new nodo($7,"p_cerrar"));
	$$.pushHijo(new nodo($8,"r_puntocoma"));
}
|	error r_puntocoma {
		console.error('Error Sintactico: ' + yytext + ' linea ' + this._$.first_line + ' columna ' + this._$.first_column);

		$$ = new nodo("","mdo");
		$$.pushHijo("","Error");
		sintacticoMalos.push(new errorSintactico($1,"error en mdo",this._$.first_line,this._$.first_column));
	}

;
