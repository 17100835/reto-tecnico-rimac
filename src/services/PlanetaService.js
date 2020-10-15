const moment = require('moment');
const axios = require('axios');
const Planeta = require('../../api/models/Planeta');

module.exports = {
		
	//Guardar identificador externo de cotizacion
	async obtenerPlanetasService() { 
		return await Planeta.getData(); 		
	}, 
	
	
	async registrarPlanetaService(idPlaneta) { 	
		
		let urlSWAPI = `https://swapi.py4e.com/api/planets/${idPlaneta}/`;		
		let instance = axios.create({ baseURL: urlSWAPI });

		return instance.get().then((result) => { 
			let data = this.adaptador(result.data);			
			return Planeta.insertData(data).then((res) => { return { id: res.insertId, ...data } }); 
		}).catch((err) => { 
			console.log("ERROR => ", err) 
		});							
	},
	
	adaptador(data){

		let registro = {
			nombre: data.name,
			periodo_rotacion: data.rotation_period,
			periodo_orbita: data.orbital_period,
			diametro: data.diameter,
			clima: data.climate,
			gravedad: data.gravity,
			terreno: data.terrain,
			superficieAgua: data.surface_water,
			poblacion: data.population,
			fecha_creacion: data.created,
			fecha_edicion: data.edited,
			url: data.url

		}

		return registro;

	}
};
