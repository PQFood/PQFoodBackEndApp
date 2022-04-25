const express = require('express');
const router = express.Router();
const admincontroller = require('../app/controllers/AdminControllers');



router.post('/adminConfirmOrder', admincontroller.adminConfirmOrder);
router.post('/adminCancelOrder', admincontroller.adminCancelOrder);
router.get('/adminGetShip', admincontroller.adminGetShip);
router.get('/adminGetOrder', admincontroller.adminGetOrder);



module.exports = router;
