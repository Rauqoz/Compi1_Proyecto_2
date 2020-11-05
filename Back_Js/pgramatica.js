const parser = require('./analizadorJS');

var todo = parser.parse(`
public class Hola{
    int x = 3+3/5*(3+3);
    public static void main(String[] args){
        if(X==Y){
            String A = "xD";
            char B = 'B';
            double C = 1.1;
        }else{
            
        }
    }
}

`);

function prueba(ar) {
	console.log('----------------------');
	console.log(ar);
}

prueba(todo);
