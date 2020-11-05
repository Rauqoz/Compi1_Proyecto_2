class nodo {
	constructor(token, tipo) {
		this.id = 0;
		this.token = token;
		this.tipo = tipo;
		this.nodos = [];
	}

	pushHijo(hijo) {
		this.nodo.push(hijo);
	}
}

module.exports = nodo;
