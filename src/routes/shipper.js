const express = require('express');
const router = express.Router();
const ShipperController = require('../app/controllers/ShipperController');



// router.post('/changeQuantityWarehouse', ShipperController.changeQuantityWarehouse);
// router.get('/getOneWarehouse', ShipperController.getOneWarehouse);
// router.get('/getWarehouse', ShipperController.getWarehouse);
// router.get('/completeOrder', ShipperController.completeOrder);
// router.post('/setNote', ShipperController.setNote);
router.get('/deleteBookShip', ShipperController.deleteBookShip);
router.get('/confirmBookShip', ShipperController.confirmBookShip);
router.get('/getBookShip', ShipperController.getBookShip);
router.get('/homeShipper', ShipperController.homeShipper);

module.exports = router;
