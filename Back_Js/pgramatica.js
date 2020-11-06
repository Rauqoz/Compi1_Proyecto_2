const parser = require('./analizadorJS');

var todo = parser.parse(`
public class sentencias {

	public void sentencias2 (){
		
		system.out.println(t);
		
	do{
		int x;
	}while (t == 10 && x < 5);
			

	}
}


`);

function prueba(ar) {
	console.log('----------------------');
	console.log(ar);
	console.log('----------------------');
	console.log(ar.raiz.traduccion());
}

prueba(todo);
