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

	traduccion() {
		this.traduc = '';
		this.traduc += this.tTraducido;

		for (let i in this.nodos) {
			if (this.nodos[i].nodos != null) {
				this.traduc += this.nodos[i].traduccion();
			}
		}
		return this.traduc;
	}
}

module.exports = nodo;
