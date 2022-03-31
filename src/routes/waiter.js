const express = require('express');
const router = express.Router();
const WaiterController = require('../app/controllers/WaiterControllers');

router.get('/getOrderEdit', WaiterController.getOrderEdit);

router.get('/getOrder', WaiterController.getOrder);
router.post('/addOrder', WaiterController.addOrder);
router.get('/getFood', WaiterController.getFood);
router.get('/homeWaiter', WaiterController.homeWaiter);

module.exports = router;
