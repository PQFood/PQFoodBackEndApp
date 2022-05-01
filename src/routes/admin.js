const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/AdminControllers');



router.post('/addStaff', admincontroller.addStaff);

router.get('/checkStaffExist', admincontroller.checkStaffExist);
router.post('/deleteStaff', admincontroller.deleteStaff);
router.get('/listStaff', admincontroller.listStaff);
router.post('/cancelOrder', admincontroller.cancelOrder);
router.post('/cancelBookShip', admincontroller.cancelBookShip);
router.get('/getDetailShipCurrent', admincontroller.getDetailShipCurrent);
router.get('/getDetailOrderCurrent', admincontroller.getDetailOrderCurrent);
router.get('/adminGetShipCurrent', admincontroller.adminGetShipCurrent);
router.get('/adminGetOrderCurrent', admincontroller.adminGetOrderCurrent);
router.post('/adminConfirmShip', admincontroller.adminConfirmShip);
router.post('/adminCancelShip', admincontroller.adminCancelShip);
router.post('/adminConfirmOrder', admincontroller.adminConfirmOrder);
router.post('/adminCancelOrder', admincontroller.adminCancelOrder);
router.get('/adminGetShip', admincontroller.adminGetShip);
router.get('/adminGetOrder', admincontroller.adminGetOrder);



module.exports = router;
