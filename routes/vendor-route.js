const express = require('express')
const router = express.Router()
const { 
    createVendor,
    getVendor,
    getVendors,
    updateVendor,
    deleteVendor
} = require('../controllers/vendor-controller')
const { isLogin, isAdmin } = require("../middlewares/auth")

router.get('/', isLogin, getVendors)
router.get('/:vendorId', isAdmin, getVendor)
router.post('/', isAdmin, createVendor)
router.put('/:vendorId', isAdmin, updateVendor)
router.delete('/:vendorId', isAdmin, deleteVendor)

module.exports = router