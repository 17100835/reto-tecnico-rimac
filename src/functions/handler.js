const moment = require('moment');

class Handler {
	/**
	 * Handler
	 * @param request http low level payload
	 * @param context running thread's context
	 * @param middleware { before: [], after: [] }
	 */
	constructor(request, context, callback, middleware = {}, logginService = () => { }, skipHTTPresponse = false, skipStringify = false) {
		console.log(request, context, callback);
		this.middleware = middleware;
		this.request = request;
		this.response = {};
		if (logginService) {
			console.log('request ==> ', this.request);
		}
		this.context = context;
		this.requestData = this.request.body ? JSON.parse(this.request.body) : {};
		this.requestContext = request.requestContext;
		this.path = this.request.pathParameters ? (this.request.pathParameters.operacion || 'generico') : 'generico';
		this.id = this.request.pathParameters ? (this.request.pathParameters.id || null) : null;
		this.method = request.httpMethod || '';
		this.callback = callback;
		this.triggerSource = request.triggerSource;
		this.logginService = logginService;
		this.skipHTTPresponse = skipHTTPresponse;
		this.skipStringify = skipStringify;
		this.callbackMessage = null;
		console.log('*'.repeat(100));
		console.log('Handling request:');
		console.log(`path: ${this.path}`);
		console.log(`data: ${JSON.stringify(this.requestData)}`);
		console.log(`id: ${this.id}`);
		console.log(`method:${this.method}`);
		console.log('*'.repeat(100));
	}

	async dispatch() {
		if (this.middleware.before) {
			let tempRequestData = this.requestData;
			// eslint-disable-next-line no-restricted-syntax
			for (const hook of this.middleware.before) {
				// eslint-disable-next-line no-await-in-loop
				tempRequestData = await hook(tempRequestData, this.requestContext);
			}
			this.requestData = tempRequestData;
		}
		let method = null;
		if (!this.triggerSource) {
			method = this[`${this.method}_${this.path}`];
		} else {
			method = this[`TRIGGER_${this.triggerSource}`];
		}

		if (!method) {
			const error = { summary: 'Operación no soportada.' };
			return Promise.reject(error);
		}
		return method();
	}

	renderToResponse(statusCode) {
		console.log('renderToResponse', this.response);
		this.response = {
			statusCode: statusCode || 501,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'false',
				'Access-Control-Allow-Methods': 'POST,PUT,OPTIONS,GET',
				'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
			},
			body: !this.skipStringify ? JSON.stringify(this.response) : this.response,
		};
	}

	async run() {
		const start = moment();
		let statusCode = 200;
		try {
			this.response = await this.dispatch();
		} catch (error) {
			console.error(`lambda error: ${error.stack}`);
			this.response = error.summary;
			statusCode = error.status;
			this.logginService();
		} finally {
			console.log(`Duration: ${(moment() - start) / 1000} Seconds`);
			if (this.middleware.after) {
				this.middleware.after.forEach((hook) => {
					this.response = hook(this.response, statusCode, this.requestContext);
				});
				let tempResponse = this.response;
				// eslint-disable-next-line no-restricted-syntax
				for (const hook of this.middleware.after) {
					// eslint-disable-next-line no-await-in-loop
					tempResponse = await hook(this.response, statusCode, this.requestContext);
				}
				this.response = tempResponse;
			}
			if (!this.skipHTTPresponse) this.renderToResponse(statusCode);
		}
		return this.callback(this.callbackMessage, this.response);
	}

	static BuildResponse({
		statusCode,
		message
	}) {
		console.log('building response');
		this.response = {
			statusCode: statusCode || 501,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': 'false',
				'Access-Control-Allow-Methods': 'POST,PUT,OPTIONS,GET',
				'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent',
			},
			body: JSON.stringify(message),
		};
	}
}

module.exports = Handler;
