module.exports.PromesaWrapper = (metodo, parametros) => {
	return new Promise((resolve, reject) => {
		metodo(...parametros, (resp) => {
			resolve(resp);
		});
	});
};