/**
 * Ejemplo Intérprete Sencillo con Jison utilizando Nodejs en Ubuntu
 */

/* Definición Léxica */
%lex

%options case-insensitive

%%

\s+											// se ignoran espacios en blanco
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

"console.write"	return 'RIMPRIMIR';
"int"				return 'RNUMERO';
"string"			return 'RSTRING';
"double"			return 'RDOUBLE';
"bool"				return 'RBOOL';
"char"				return 'RCHAR';
"while"				return 'RMIENTRAS';
"do"				return 'RDO';
"if"				return 'RIF';
"else"				return 'RELSE';
"for"				return 'RPARA';
"switch"			return 'RSWITCH';
"case"				return 'RCASE';
"default"			return 'RDEFAULT';
"break"				return 'RBREAK';
"continue"			return 'RCONTINUE';
"return"			return 'RRETURN';
"void"				return 'RVOID';
"main"				return 'RMAIN';


":"					return 'DOSPTS';
";"					return 'PTCOMA';
"{"					return 'LLAVIZQ';
"}"					return 'LLAVDER';
"("					return 'PARIZQ';
")"					return 'PARDER';

"+="				return 'O_MAS';
"-="				return 'O_MENOS';
"*="				return 'O_POR';
"/="				return 'O_DIVIDIDO';
"&&"				return 'AND'
"||"				return 'OR';

"+"					return 'MAS';
"-"					return 'MENOS';
"*"					return 'POR';
"/"					return 'DIVIDIDO';
"&"					return 'CONCAT';

"<="				return 'MENIGQUE';
">="				return 'MAYIGQUE';
"=="				return 'DOBLEIG';
"!="				return 'NOIG';

"<"					return 'MENQUE';
">"					return 'MAYQUE';
"="					return 'IGUAL';

"!"					return 'NOT';
","					return 'COMA';

\"[^\"]*\"				{ yytext = yytext.substr(1,yyleng-2); return 'CADENA'; }
\'[^\']*\'				{ yytext = yytext.substr(1,yyleng-2); return 'HTML'; }
[0-9]+("."[0-9]+)?\b  	return 'DECIMAL';
[0-9]+\b				return 'ENTERO';
([a-zA-Z])[a-zA-Z0-9_]*	return 'IDENTIFICADOR';


<<EOF>>				return 'EOF';
.					{ console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column); }

/lex


%{
	var htmlS ="";
	var traductor= "";
	var idS = "";
	var primi="";
	var errorT = "";
	var ast="";
	
%}


/* Asociación de operadores y precedencia */
%left 'CONCAT'
%left 'MAS' 'MENOS'
%left 'POR' 'DIVIDIDO'
%left UMENOS

%start ini

%% /* Definición de la gramática */

ini
	: declaraciones EOF 
	{
		ast+=""
		
		var todo = {t:$1, Vid:idS,VHtml: htmlS,errores:errorT};
				return todo;
		}
;


instrucciones
	: instrucciones instruccion 		{ $$=$1+"\n\n"+$2;} 
	| instruccion						{$$=$1;}
	| error { 
		console.error('Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
		errorT+='Este es un error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column;
		}
;

instruccion
	: RIMPRIMIR PARIZQ expresion_cadenas PARDER PTCOMA { $$="Print("+$3+")\n";  }
	| asignacion								{ $$= $1;}
	| sentencias								{ $$= $1;}
	 

;

declaraciones 
	: declaraciones declaracion					{$$=$1+"\n\n"+$2;  }
	| declaracion								{$$=$1;}
;

declaracion
	: metodo									{$$=$1;}
	| funcion									{$$=$1;}
	| main										{$$=$1;}
	| asignacion								{ $$= $1;}
	
;

asignaciones
	: asignaciones asignacion					{$$=$1+"\n\n"+$2;}
	| asignacion								{$$=$1;}
;

asignacion
	:RNUMERO lista_id 	PTCOMA 					{ $$=" \n var "+$2; idS+= " \n int/"+$2+"/"+this._$.first_line;   	}
	| RSTRING lista_id 	PTCOMA 					{ $$=" \n var "+$2; idS+= " \n string/"+$2+"/"+this._$.first_line; 	}
	| RBOOL lista_id 	PTCOMA 					{ $$=" \n var "+$2; idS+= " \n bool/"+$2+"/"+this._$.first_line;   	}
	| RCHAR lista_id PTCOMA 					{ $$=" \n var "+$2; idS+= " \n char/"+$2+"/"+this._$.first_line;  	}
	| RDOUBLE lista_id 	PTCOMA 					{ $$=" \n var "+$2; idS+= " \n double/"+$2+"/"+this._$.first_line; 	}
	| IDENTIFICADOR IGUAL expresion_cadenas	PTCOMA	{ $$ =$1+"="+$3;console.log($$); }
;

metodo
	: RVOID IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ instrucciones LLAVDER
												{$$ = "def "+$2+"("+$4+"){\n\n 	"+$7+"\n\n}";}
	| RVOID IDENTIFICADOR PARIZQ PARDER LLAVIZQ instrucciones LLAVDER
												{$$ = "def "+$2+"(){\n 	"+$6+"\n}";}
	| RVOID IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ  LLAVDER
												{$$ = "def "+$2+"("+$4+"){\n\n }";}
	| RVOID IDENTIFICADOR PARIZQ PARDER LLAVIZQ LLAVDER
												{$$ = "def "+$2+"(){\n\n }";}
;

main
	: RVOID RMAIN PARIZQ PARDER LLAVIZQ instrucciones LLAVDER	{$$="def main( ): {\n"+$6+"if name = \" main \": \n 	main()"; }
	| RVOID RMAIN PARIZQ PARDER LLAVIZQ  LLAVDER				{$$="def main( ): {\n if name = \" main \": \n 	main()"; }
;

funcion
	: RNUMERO IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n 	"+$7+"\n"+$8+"\n}\n";}
	| RNUMERO IDENTIFICADOR PARIZQ PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n 	"+$6+"\n"+$7+"\n}\n";}
	| RNUMERO IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ  sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n "+$7+"\n}\n";}
	| RNUMERO  IDENTIFICADOR PARIZQ PARDER LLAVIZQ sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n\n  "+$6+"\n}\n";}


	| RSTRING IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n 	"+$7+"\n"+$8+"\n}\n";}
	| RSTRING IDENTIFICADOR PARIZQ PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n 	"+$6+"\n"+$7+"\n}\n";}
	| RSTRING IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ  sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n "+$7+"\n}\n";}
	| RSTRING  IDENTIFICADOR PARIZQ PARDER LLAVIZQ sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n\n  "+$6+"\n}\n";}


	| RCHAR IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n 	"+$7+"\n"+$8+"\n}\n";}
	| RCHAR IDENTIFICADOR PARIZQ PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n 	"+$6+"\n"+$7+"\n}\n";}
	| RCHAR IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ  sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n "+$7+"\n}\n";}
	| RCHAR  IDENTIFICADOR PARIZQ PARDER LLAVIZQ sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n\n  "+$6+"\n}\n";}

	| RBOOL IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n 	"+$7+"\n"+$8+"\n}\n";}
	| RBOOL IDENTIFICADOR PARIZQ PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n 	"+$6+"\n"+$7+"\n}\n";}
	| RBOOL IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ  sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n "+$7+"\n}\n";}
	| RBOOL  IDENTIFICADOR PARIZQ PARDER LLAVIZQ sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n\n  "+$6+"\n}\n";}


	| RDOUBLE IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n 	"+$7+"\n"+$8+"\n}\n";}
	| RDOUBLE IDENTIFICADOR PARIZQ PARDER LLAVIZQ instrucciones sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n 	"+$6+"\n"+$7+"\n}\n";}
	| RDOUBLE IDENTIFICADOR PARIZQ primitivos PARDER LLAVIZQ  sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"("+$4+"){\n\n "+$7+"\n}\n";}
	| RDOUBLE IDENTIFICADOR PARIZQ PARDER LLAVIZQ sentencia_retorno LLAVDER
												{$$ = "\ndef "+$2+"(){\n\n  "+$6+"\n}\n";}
;

sentencias
	:RMIENTRAS PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER 
												{ $$="\n while "+$3+": \n	"+$6  ;  }
	|RMIENTRAS PARIZQ expresion_logica PARDER LLAVIZQ instrucciones sentencia_retornos LLAVDER 
												{ $$="\n while "+$3+": \n	"+$6+ "\n	"+$7  ;  }
	|RMIENTRAS PARIZQ expresion_logica PARDER LLAVIZQ  LLAVDER 
												{ $$="\n while "+$3+": \n"  ;  }


	| RDO LLAVIZQ instrucciones LLAVDER RMIENTRAS PARIZQ expresion_logica PARDER PTCOMA
												{ $$="\n while true:  \n	"+$3+"\n if("+$7+"):\n 	break\n"  ;  }
	| RDO LLAVIZQ  LLAVDER RMIENTRAS PARIZQ expresion_logica PARDER PTCOMA
												{ $$="\n while true:  "+"\n if("+$6+"):\n break\n"  ; }
	
	
	| RIF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER
												{ $$="\n if "+$3+": \n	"+$6; }
	| RIF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER sentencia_controles 
												{ $$="\n if "+$3+": \n	"+$6 +"\n"+$8 ; }
	| RIF PARIZQ expresion_logica PARDER LLAVIZQ  LLAVDER
												{ $$="\n if "+$3+": \n"; ;}
	
	
	
	| RPARA PARIZQ RNUMERO IDENTIFICADOR IGUAL expresion PTCOMA expresion_logica PTCOMA IDENTIFICADOR MAS MAS PARDER LLAVIZQ instrucciones LLAVDER	
												{ $$ = "\nfor "+$4+ " in range("+$6+","+atri+"): \n	"+$15+"\n"; }
	| RPARA PARIZQ RNUMERO IDENTIFICADOR IGUAL expresion PTCOMA expresion_logica PTCOMA IDENTIFICADOR MENOSS MENOS PARDER LLAVIZQ instrucciones LLAVDER	
												{ $$ = "\nfor "+$4+ " in range("+$6+","+atri+"): \n	"+$15+"\n";  }
	
	| RSWITCH PARIZQ expresion PARDER LLAVIZQ  casos LLAVDER
												{$$ = "\ndef switch(case,"+$3+"): \n  switcher = {\n	"+$6+"	}\n"; }
;

casos
	: casos  caso_evaluar			{ $$ = $1+"\n	"+$2;}
	| caso_evaluar					{$$ = $1; }
	;

caso_evaluar 
	: RCASE expresion DOSPTS instrucciones
   												{ $$ = $2+":\n	"+$4+",\n"; }
  	| RDEFAULT DOSPTS instrucciones
    											{ $$ = $1+":\n	"+$3+",\n"; }
	| RCASE expresion DOSPTS instrucciones sentencia_retornos
   												{ $$ = $2+":\n	"+$4+",\n"; }
  	| RDEFAULT DOSPTS instrucciones sentencia_retornos
    											{ $$ = $1+":\n 	"+$3+",\n "; }
;

sentencia_retorno
	:RRETURN PTCOMA								{$$=$1;}
	|RCONTINUE PTCOMA							{$$=$1;}
	|RRETURN  expresion_cadenas PTCOMA		{$$=$1+" "+$2;}
	
	
;

sentencia_retornos
	:sentencia_retorno							{ $$=$1;}
	|sentencia_switch							{ $$=$1;}
	
;
sentencia_switch
	: RBREAK PTCOMA								{ $$= $1;}
;


sentencia_controles
	:sentencia_controles sentencia_control				{ $$ = $1+" \n	"+$2;}
	|sentencia_control									{ $$ = $1;}
	| RELSE LLAVIZQ instrucciones LLAVDER
														{ $$=" else: \n	"+$3;  }
	|RELSE LLAVIZQ  LLAVDER
														{ $$=" else: \n";  }
;

sentencia_control
	: RELSE RIF PARIZQ expresion_logica PARDER LLAVIZQ instrucciones LLAVDER 			{ $$=" elif:"+$4+": \n	"+$7 ;  }
	| RELSE RIF PARIZQ expresion_logica PARDER LLAVIZQ  LLAVDER 						{ $$=" elif: "+$4+": \n" ; }
	
;

expresion_relacional
	: expresion MAYQUE expresion		{ atri=$3; $$ = $1+">"+$3; }
	| expresion MENQUE expresion		{ atri=$3; $$ = $1+"<"+$3; }
	| expresion MAYIGQUE expresion		{ atri=$3; $$ = $1+">="+$3; }
	| expresion MENIGQUE expresion		{ atri=$3; $$ = $1+"<="+$3; }
	| expresion DOBLEIG expresion		{ atri=$3; $$ = $1+"=="+$3; }
	| expresion NOIG expresion			{ atri=$3; $$ = $1+"!="+$3; }
	| NOT expresion							{ atri=$2; $$ = " NOT "+$2; }
	
;

expresion_logica
	: expresion_relacional AND expresion_relacional     { $$ = $1+" AND "+$3; }
	| expresion_relacional OR expresion_relacional 		{ $$ = $1+" OR "+$3; }
	
	| expresion_relacional								{ $$ = $1; }
	
;

parametos
	:lista_id COMA  IDENTIFICADOR  		{ $$= $1+","+$3; }
	| IDENTIFICADOR 					{ $$= $1;}
;


lista_id 
	: parametos								{ $$= $1;}
	| lista_id IGUAL expresion_cadenas		{ $$ = $1+"="+$3;}
;





expresion_cadenas
	: expresion_cadenas MAS expresion_cadena			{ $$ = $1+"+"+$3;}
	| expresion_cadena									{$$ = $1; }
	
;

expresion_cadena
	: CADENA						{ $$ = $1; }
	| HTML							{ htmlS+=$1; $$ = $1; }
	| expresion						{ $$ = $1; }
	
;



expresion
	: MENOS expresion 	%prec UMENOS		    { $$ = ""+$2; }
	| expresion MENOS expresion     			{ $$ = $1 +"-"+ $3; }
	| expresion POR expresion       			{ $$ = $1 +"*"+ $3; }
	| expresion DIVIDIDO expresion  			{ $$ = $1 +"/"+ $3; }
	| ENTERO                        			{ $$ = $1; }
	| DECIMAL                       			{ $$ = $1; }
	| PARIZQ expresion PARDER       			{ $$ = "("+$2+")"; }
	| IDENTIFICADOR								{ $$ = $1; }
;

primitivos
	: primitivos COMA primitivo					{ $$ = $1+","+$3;}
	| primitivo									{ $$= $1; }
	|IDENTIFICADOR								{ $$= $1; }
;

primitivo
	:RNUMERO IDENTIFICADOR						{ $$= $1+" "+$2;}
	|RSTRING IDENTIFICADOR						{ $$= $1+" "+$2;}
	|RBOOL IDENTIFICADOR						{ $$= $1+" "+$2;}
	|RCHAR IDENTIFICADOR						{ $$= $1+" "+$2;}
	|RDOUBLE IDENTIFICADOR						{ $$= $1+" "+$2;}
	
;