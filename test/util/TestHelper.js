"use strict";

exports.getTestEvent = (body, metodo, id, operacion) => {
	return {
		body: JSON.stringify(body),
		httpMethod: metodo,
	};
}

exports.LambdaPromise = (metodoLambda, event, context = {}, muteConsoleLog = true) => {
	if (muteConsoleLog) {
		console.log = () => { };
		console.error = () => { };
	}
	return new Promise((resolve, reject) => {
		metodoLambda(event, context, (err, res) => {
			if (muteConsoleLog) {
				delete console.log;
				delete console.error;
			}
			if (err) {
				console.error(err);
				reject(err);
			}

			resolve(res);
		});
	});
}

exports.MethodPromise = (metodoLambda, params) => {
	return metodoLambda(...params);
}