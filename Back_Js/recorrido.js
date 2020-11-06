class recorrido {
	constructor() {}

	recorrer_arbol(nodo) {
		var grafic;
		if (nodo.tTraducido != '') {
			grafic = '<ul><li data-jstree=\'{ "opened" : true }\'>' + nodo.tTraducido + ' (' + nodo.tTipo + ')' + '\n';
		} else {
			grafica = '<ul><li data-jstree=\'{ "opened" : true }\'>' + nodo.tTraducido + '\n';
		}
		nodo.nodos.forEach((actual) => {
			grafic += this.recorrer_arbol(actual);
		});
		grafic += '</li></ul>' + '\n';
		return grafic;
	}
}
