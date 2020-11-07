class nodo {
	constructor(tTraducido, tTipo) {
		this.id = 0;
		this.tTraducido = tTraducido;
		this.tTipo = tTipo;
		this.hijos = [];
	}

	pushHijo(hijo) {
		this.hijos.push(hijo);
	}

	traduccion() {
		this.traduc = '';
		this.traduc += this.tTraducido;

		for (let i in this.hijos) {
			if (this.hijos[i].hijos != null) {
				this.traduc += this.hijos[i].traduccion();
			}
		}
		return this.traduc;
	}
}

module.exports = nodo;
