require('dotenv').config()
const express = require('express')
const router = express.Router()
const vendorRoute = require('./vendor-route')
const sepedaRoute = require('./sepeda-route')
const authRoute = require('./auth-route')

router.use('/auth', authRoute);
router.use('/sepeda', sepedaRoute);
router.use('/vendor', vendorRoute);

module.exports = router;

