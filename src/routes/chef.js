const express = require('express');
const router = express.Router();
const ChefController = require('../app/controllers/ChefControllers');


// router.get('/getOrder', ChefController.getOrder);
// router.post('/addOrder', ChefController.addOrder);
// router.get('/getFood', ChefController.getFood);
router.get('/homeChef', ChefController.homeChef);

module.exports = router;
