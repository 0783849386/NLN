const express = require('express');
const router = express.Router();

const controller = require('../controllers/borrowBook.controller');
const verifyToken = require('../middleware/auth.middleware')


router.post('/addPhieuMuon', verifyToken, controller.addPhieuMuon);
router.get('/getPhieuMuon', verifyToken, controller.getPhieuMuon);
router.get('/getAllPhieuMuon', verifyToken, controller.getAllPhieuMuon);
router.get('/getPhieuMuon/:loginname', verifyToken, controller.getPhieuMuonName);//lấy về chi tiết phiếu mượn của loginname
router.post('/acceptRequest', verifyToken, controller.acceptRequest);
router.get('/getMuonSach', verifyToken, controller.getMuonSach);
router.get('/getDetailsMuonSach/:loginname', verifyToken, controller.getDetailsMuonSach);//lấy về chi tiết mượn sách của loginname
router.post('/giveBook', verifyToken, controller.giveBook);
router.delete('/deletePhieuMuon/:loginname', verifyToken, controller.deletePhieuMuon)
router.post('/loadUser', verifyToken, controller.loadUser)
router.post('/plusView', verifyToken, controller.plusView)
module.exports = router;