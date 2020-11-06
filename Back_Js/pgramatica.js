const parser = require('./analizadorJS');

var todo = parser.parse(`
public class Hola{
        
		public void yy (int x , string p){
			int x = o;
			u ;
			string p = "hola";
		}


}


public interface hfah{
 
}


`);

function prueba(ar) {
	// console.log('----------------------');
	// console.log(ar);
	console.log('----------------------');
	// traduccion(ar.raiz);
	console.log(ar.raiz.traduccion());
}

prueba(todo);
