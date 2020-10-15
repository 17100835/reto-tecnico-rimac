const Sails = require('sails');
const Handler = require('./Handler');
const PlanetaService = require('../services/PlanetaService');

module.exports.planeta = (request, context, callback) => {
	if (request.source === 'serverless-plugin-warmup') {
		console.log('Calentando el lambda');
		return callback(null, 'Lambda esta caliente!');
	}

	const sailsApp = new Sails.constructor();
	const middleware = {
		before: [
			async (reqData) => {				
				return reqData;
			},
		],
		after: [
			async (response) => {
				await sailsApp.lower();
				return response;
			},
		],
	};

	const handler = new Handler(request, context, callback, middleware);

	handler.GET_obtenerPlanetas = () => {		
		return PlanetaService.obtenerPlanetasService(handler.requestData);
	};

	handler.POST_registrarPlaneta = () => {		
		return PlanetaService.registrarPlanetaService(handler.id);
	};   
	    
	return handler.run();
};
