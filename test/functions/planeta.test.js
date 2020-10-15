const assert = require('assert');
const testHelper = require('../util/TestHelper');
const planetaFunction = require('../../src/functions/planeta');

describe('Interactuando con SWAPI', () => {	
    
    describe.skip('Obteniendo informacion de planetas a traves de SWAPI', () => {
		let resultado;
		let resultadoBody;
		before(async () => {
			const event = {
				body: JSON.stringify({
					
				}),
				pathParameters: { operacion: 'obtenerPlanetas' },
				httpMethod: 'GET',
			};
			resultado = await testHelper.LambdaPromise(planetaFunction.planeta, event, {}, false);
			resultadoBody = JSON.parse(resultado.body);
			console.log(resultadoBody);			
		});
		describe('Análisis general de la respuesta del endpoint', () => {
			it('El endpoint debe responder con status 200', () => {
				assert.deepEqual(resultado.statusCode, 200);
			});			
		});		
    }); 
    
    describe('Registrando informacion obtenida de Swapi en BDLocal', () => {
		let resultado;
		let resultadoBody;
		before(async () => {
			const event = {
				body: JSON.stringify({					
					
				}),
				pathParameters: { operacion: 'registrarPlaneta', id: 1 },
				httpMethod: 'POST',
			};
			resultado = await testHelper.LambdaPromise(planetaFunction.planeta, event, {}, false);
			resultadoBody = JSON.parse(resultado.body);
			console.log(resultadoBody);			
		});
		describe('Análisis general de la respuesta del endpoint', () => {
			it('El endpoint debe responder con status 200', () => {
				assert.deepEqual(resultado.statusCode, 200);
			});			
		});		
    });

});
