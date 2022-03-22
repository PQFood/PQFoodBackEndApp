const express = require('express');
const router = express.Router();
const WaiterController = require('../app/controllers/WaiterControllers');

// router.get('/addOrder', WaiterController.addOrder);
router.get('/getFood', WaiterController.getFood);

router.get('/homeWaiter', WaiterController.homeWaiter);

module.exports = router;
