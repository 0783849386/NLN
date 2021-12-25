const express = require('express');
const router = express.Router();

const controller = require('../controllers/general.controller');
const verifyToken = require('../middleware/auth.middleware')

router.post('/getUser', verifyToken, controller.getUser);
router.post('/updateUser', verifyToken, controller.updateUser);
router.get('/loadAllHistory', verifyToken, controller.loadAllHistory)
router.post('/loadUserHistory', verifyToken, controller.loadUserHistory)
router.get('/loadBorrowingHistory', verifyToken, controller.loadBorrowingHistory)
router.get('/loadLateHistory', verifyToken, controller.loadLateHistory)
router.get('/loadPersonal', verifyToken, controller.loadPersonal)
router.get('/loadListBorrowBook', verifyToken, controller.loadListBorrowBook)
router.get('/loadNewBook', controller.loadNewBook)
router.get('/loadTopBook', controller.getTopView)
module.exports = router;