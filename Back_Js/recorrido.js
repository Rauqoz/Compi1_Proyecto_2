var id_n = 1;
class recorrido {
	constructor() {}

	generar_grafica(nodo) {
		var grafica = '';
		//id unicos
		if (nodo.id == 0) {
			nodo.id = id_n;
			id_n++;
		}
		//id [label = valor fillcolor = "#d62728" shape = "circle"];
		// console.log(nodo.id + ' [label = "' + nodo.tTipo + '" fillcolor = "#d62728" shape = "circle"];');
		if (nodo.id == undefined || nodo.tTipo == undefined) {
		} else {
			grafica += nodo.id + '[label="' + nodo.tTipo + '"fillcolor="#d62728"shape="circle"];';
		}

		if (nodo.hijos != null) {
			nodo.hijos.forEach((element) => {
				// id -> id;
				// console.log(nodo.id + '->' + id_n + ';');
				grafica += nodo.id + '->' + id_n + ';' + this.generar_grafica(element);
			});
		}
		return grafica;
	}
}

module.exports = recorrido;
