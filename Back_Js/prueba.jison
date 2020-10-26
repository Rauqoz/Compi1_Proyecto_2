/* description: Prueba Base */


/* lexical grammar */
%lex
%%



\s+                   /* skip whitespace */
[0-9]+('.'[0-9]+)?     {return 'numero'; console.log("numero");}
"*"                   return 'asterisco'
"/"                   return 'barra'
"-"                   return 'menos'
"+"                   return 'mas'
<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex

/* operator associations and precedence */

%left 'mas' 'menos'
%left 'asterisco' 'barra'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        {return $1;}
    ;

e
    : e mas e
        {$$ = $1+$3;}
    | e menos e
        {$$ = $1-$3;}
    | e asterisco e
        {$$ = $1*$3;}
    | e barra e
        {$$ = $1/$3;}
    | menos e %prec UMINUS
        {$$ = -$2;}
    | numero
        {$$ = $1;}
    ;
