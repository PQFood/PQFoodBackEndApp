const express = require('express');
const router = express.Router();
const ShipperController = require('../app/controllers/ShipperController');



// router.post('/changeQuantityWarehouse', ChefController.changeQuantityWarehouse);
// router.get('/getOneWarehouse', ChefController.getOneWarehouse);
// router.get('/getWarehouse', ChefController.getWarehouse);
// router.get('/completeOrder', ChefController.completeOrder);
// router.post('/setNote', ChefController.setNote);
// router.get('/getNote', ChefController.getNote);
// router.get('/deleteOrder', ChefController.deleteOrder);
// router.get('/ConfirmOrder', ChefController.ConfirmOrder);
router.get('/homeShipper', ShipperController.homeShipper);

module.exports = router;
