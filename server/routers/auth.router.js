const express = require('express');
const router = express.Router();

const controller = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware')

router.get('/', verifyToken, controller.getUser)
router.post('/login', controller.postLogin);
router.post('/register', controller.postRegister);

module.exports = router;