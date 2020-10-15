
module.exports = {
	transaccion(promesaSails) {
		const Sails = require('sails').constructor;
		const mySailsApp = new Sails();

		return new Promise((resolve, reject) => {
			mySailsApp.load({
				loadHooks: ['moduleloader', 'orm', 'userconfig']
			}, (err) => {
				if (err) {
					console.error(err);
					reject(err);
				}

				resolve(promesaSails()
					.then((data) => {
						mySailsApp.lower(reject);
						return data;
					}).catch((e) => {
						mySailsApp.lower(reject);
						throw e;
					}));
			});
		});

	}
}