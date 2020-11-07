package main
 
import (
	"fmt"      // Imprimir en consola
	"log"      //Loguear si algo sale mal
	"net/http" // El paquete HTTP
)
 
func main() {
	http.Handle("/", http.FileServer(http.Dir("./")))
 
	direccion := ":4300" // Como cadena, no como entero; porque representa una dirección
	fmt.Println("Servidor listo escuchando en " + direccion)
	log.Fatal(http.ListenAndServe(direccion, nil))
}