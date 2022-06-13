const { Pool } = require('pg');

const pool = new Pool({
	host: '192.168.1.10',
	user: 'postgres',
	password: '123datamaule2019.,#-',
	database: 'cartaQr-demo',
});

const getFamilia = async (req, res) => {
	try {
		const response = await pool.query('SELECT * FROM familia');
		res.json(response.rows);
	} catch (e) {
		res.json(e.message);
	}
};

const getProducto = async (req, res) => {
	try {
		const { idFamilia } = req.body;
		const response = await pool.query(
			'select * from producto where id_familia = $1',
			[idFamilia]
		);
		res.json(response.rows);
	} catch (e) {
		res.json(e.message);
	}
};

const getEmpresa = async (req, res) => {
	try {
		const response = await pool.query('SELECT * FROM empresa');
		res.json(response.rows);
	} catch (e) {
		res.json(e.message);
	}
};

const createSugerencia = async (req, res) => {
	try {
		const {
			nombreCliente,
			telefonoCliente,
			correoCliente,
			observacionCliente,
		} = req.body;
		console.log(req.body);

		const response = await pool.query(
			'INSERT INTO sugerencia (nombre_cliente, telefono_cliente, correo_cliente, observacion) VALUES ($1, $2, $3, $4)',
			[nombreCliente, telefonoCliente, correoCliente, observacionCliente]
		);
	} catch (e) {
		res.json(e.message);
	}
};

module.exports = {
	getFamilia,
	getProducto,
	getEmpresa,
	createSugerencia,
};
