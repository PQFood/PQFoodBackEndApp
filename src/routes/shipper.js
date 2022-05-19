const express = require('express');
const router = express.Router();
const ShipperController = require('../app/controllers/ShipperController');


router.get('/getShipSearch', ShipperController.getShipSearch);
router.get('/getBookShipHistoryElement', ShipperController.getBookShipHistoryElement);
router.get('/getBookShipHistory', ShipperController.getBookShipHistory);
router.get('/completeBookShip', ShipperController.completeBookShip);
router.get('/receiveBookShip', ShipperController.receiveBookShip);
router.post('/editBookShip', ShipperController.editBookShip);
router.get('/getBookShipEdit', ShipperController.getBookShipEdit);
router.get('/deleteBookShip', ShipperController.deleteBookShip);
router.get('/confirmBookShip', ShipperController.confirmBookShip);
router.get('/getBookShip', ShipperController.getBookShip);
router.get('/homeShipper', ShipperController.homeShipper);

module.exports = router;
