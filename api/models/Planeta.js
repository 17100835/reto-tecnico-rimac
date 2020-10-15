
const connections = require('../../config/connections');
const conexion = connections(); 

module.exports = {

	async getData(){        
        conexion.connect;
        const sql = `select 
                     id,
                     nombre,
                     periodo_rotacion,
                     periodo_orbita,
                     diametro,
                     clima,
                     gravedad,
                     terreno,
                     superficieAgua,
                     poblacion,
                     fecha_creacion,
                     fecha_edicion,
                     url 
                     from planetas;`;
		return new Promise((resolve, reject) => {
			conexion.query(sql, [], (err, results) => {
				if (err) {
					return reject(err);
				}					
				resolve(results);
			});
		}).finally(
            conexion.end()
        );
    }, 
    
    async insertData(data){        
        conexion.connect;
        const sql = `INSERT INTO planetas(nombre, 
                                          periodo_rotacion, 
                                          periodo_orbita, 
                                          diametro, 
                                          clima, 
                                          gravedad, 
                                          terreno, 
                                          superficieAgua, 
                                          poblacion, 
                                          fecha_creacion, 
                                          fecha_edicion, 
                                          url) 
                                  values('${data.nombre}', 
                                          ${data.periodo_rotacion}, 
                                          ${data.periodo_orbita}, 
                                          ${data.diametro}, 
                                         '${data.clima}', 
                                         '${data.gravedad}', 
                                         '${data.terreno}', 
                                          ${data.superficieAgua}, 
                                          ${data.poblacion}, 
                                         '${data.fecha_creacion}', 
                                         '${data.fecha_edicion}', 
                                         '${data.url}')`;
                                       console.log("SQL => ", sql)
		return new Promise((resolve, reject) => {
			conexion.query(sql, [], (err, results) => {
				if (err) {
					return reject(err);
				}					
				resolve(results);
			});
		}).finally(
            conexion.end()
        );
	}
}
