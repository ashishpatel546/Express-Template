const express = require('express')

const isAuth = require('../middlewares/isAuth')
const appController = require('../controller/myAppController')

const router = express.Router()


router.get('/', appController.getIndex)


module.exports = router