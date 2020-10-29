const tokens = require('./lexico');

tokens.lexico(`56.main%++ 20Pedro_elmanco 15.9 1 0El_Niño_Gay15 alf@ro==>='A'
"soy una cadena bien sabrosa :3 "
//Los bronces se iran a infierno >:v
main public static alfarito
//comentario 2
@ +-+-+-- === ? { } 5.papel *8
/*comentario multi
linea 
*****/`);
tokens.printL();
