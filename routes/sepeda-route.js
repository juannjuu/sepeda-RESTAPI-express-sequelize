const express = require('express')
const router = express.Router()
const { 
    createSepeda,
    getSepedas,
    getSepeda,
    updateSepeda,
    deleteSepeda
} = require('../controllers/sepeda-controller')
const { isLogin, isAdmin } = require("../middlewares/auth")
const { uploadCloud } = require("../middlewares/uploadFile")

router.get('/', isLogin, getSepedas)
router.get('/:sepedaId', isAdmin, getSepeda)
router.post('/', isAdmin, uploadCloud("image"), createSepeda)
router.put('/:sepedaId', isAdmin, updateSepeda)
router.delete('/:sepedaId', isAdmin, deleteSepeda)

module.exports = router