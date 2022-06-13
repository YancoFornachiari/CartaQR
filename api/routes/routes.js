const { Router } = require('express');
const router = Router();

const {
	getFamilia,
	getProducto,
	getEmpresa,
	createSugerencia,
} = require('../controller/functions');

router.post('/familia', getFamilia);
router.post('/producto', getProducto);
router.get('/empresa', getEmpresa);
router.post('/sugerencia', createSugerencia);

module.exports = router;
