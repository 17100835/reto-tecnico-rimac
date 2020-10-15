module.exports.PromesaWrapper = (metodo, parametros) => {
	return new Promise((resolve, reject) => {
		metodo(...parametros, (resp) => {
			resolve(resp);
		});
	});
};

module.exports.levenshteinDistance = (a, b) => {
	const distanceMatrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

	for (let i = 0; i <= a.length; i += 1) {
		distanceMatrix[0][i] = i;
	}

	for (let j = 0; j <= b.length; j += 1) {
		distanceMatrix[j][0] = j;
	}

	for (let j = 1; j <= b.length; j += 1) {
		for (let i = 1; i <= a.length; i += 1) {
			const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
			distanceMatrix[j][i] = Math.min(
				distanceMatrix[j][i - 1] + 1, // deletion
				distanceMatrix[j - 1][i] + 1, // insertion
				distanceMatrix[j - 1][i - 1] + indicator, // substitution
			);
		}
	}
	return distanceMatrix[b.length][a.length];
};

module.exports.levenshteinRatio = (objeto, listaObj, porcAcep) => {
	let a = '';
	let b = '';
	let maxLength;
	let lDistance;
	let percentaje;
	for (let i = 0; i < listaObj.length; i += 1) {
		a = objeto.toUpperCase();
		b = (listaObj[i].modelo).toUpperCase();
		a.toUpperCase();
		b.toUpperCase();
		if (a.length > b.length) {
			maxLength = a.length;
		} else {
			maxLength = b.length;
		}
		lDistance = this.levenshteinDistance(a, b);
		// lDistance = hammingDistance(a,b);
		percentaje = (1 - lDistance / maxLength) * 100;
		listaObj[i].porc = percentaje;
	}
	listaObj = listaObj.filter(item => item.porc >= porcAcep);
	return listaObj;
};

exports.randomValue = (length, valmax, valmin) => {
	if (length) {
		valmax = 10 ** (length + 1);
		valmin = 10 ** length;
	}
	return Math.floor(Math.random() * (valmax - valmin) + valmin);
}