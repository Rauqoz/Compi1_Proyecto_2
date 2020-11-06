const parser = require('./analizadorJS');

var todo = parser.parse(`
/********************************************************
*********************************************************
*********************COMPILADORES 1**********************
*********************************************************
********************SEGUNDO SEMESTRE*********************
*********************************************************
**************************2020***************************
*********************************************************
*******************ENTRADA DE PRUEBA*********************
*********************************************************
***********************PROYECTO 2************************
*********************************************************
********************************************************/

public class error {

   
    public static void main(String[] args) {
        int x = 1;
 
        // Salir cuando x llega a ser mayor que 4
        while (x <= 4)
        {
            System.out.println("Valor de x: " + x);
 
            //incrementa el valor de x para la siguiente iteración
            x++;
        }


        do {   System.out.print ("Contando... " + (contador + 1) );

            contador += 1;

        } while (contador < 10); 
    }


}


`);

function prueba() {
	console.log('----------------------');
	console.log(todo);
	console.log('----------------------');
	console.log(todo.raiz.traduccion());
}

prueba();
