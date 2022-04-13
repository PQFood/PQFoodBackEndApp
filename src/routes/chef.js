const express = require('express');
const router = express.Router();
const ChefController = require('../app/controllers/ChefControllers');



router.post('/changeQuantityWarehouse', ChefController.changeQuantityWarehouse);
router.get('/getOneWarehouse', ChefController.getOneWarehouse);
router.get('/getWarehouse', ChefController.getWarehouse);
router.get('/completeOrder', ChefController.completeOrder);
router.post('/setNote', ChefController.setNote);
router.get('/getNote', ChefController.getNote);
router.get('/deleteOrder', ChefController.deleteOrder);
router.get('/ConfirmOrder', ChefController.ConfirmOrder);
router.get('/homeChef', ChefController.homeChef);

module.exports = router;
