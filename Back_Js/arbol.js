class nodo {
	constructor(tTraducido, tTipo) {
		this.id = 0;
		this.tTraducido = tTraducido;
		this.tTipo = tTipo;
		this.nodos = [];
	}

	pushHijo(hijo) {
		this.nodo.push(hijo);
	}
}

module.exports = nodo;
