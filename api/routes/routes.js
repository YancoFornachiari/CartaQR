const { Router } = require('express');
const router = Router();

const {
	getFamilia,
	getProducto,
	getEmpresa,
	createSugerencia,
	//getAllFamilia,
} = require('../controller/functions');

router.post('/familia', getFamilia);
router.post('/producto', getProducto);
router.get('/empresa', getEmpresa);
router.post('/sugerencia', createSugerencia);
//router.post('/allFamilia', getAllFamilia);

module.exports = router;
