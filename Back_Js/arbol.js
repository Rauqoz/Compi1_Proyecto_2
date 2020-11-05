class nodo {
	constructor(tTraducido, tTipo) {
		this.id = 0;
		this.tTraducido = tTraducido;
		this.tTipo = tTipo;
		this.nodos = new Array();
	}

	pushHijo(hijo) {
		this.nodos.push(hijo);
	}
}

module.exports = nodo;
