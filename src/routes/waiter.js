const express = require('express');
const router = express.Router();
const WaiterController = require('../app/controllers/WaiterControllers');



router.get('/getOrderSearch', WaiterController.getOrderSearch);
router.post('/changePassword', WaiterController.changePassword);
router.get('/getDetailOrder', WaiterController.getDetailOrder);
router.get('/getHistoryOrder', WaiterController.getHistoryOrder);
router.post('/completeBookTable', WaiterController.completeBookTable);
router.post('/cancelBookTable', WaiterController.cancelBookTable);
router.post('/confirmBookTable', WaiterController.confirmBookTable);
router.get('/getBookTable', WaiterController.getBookTable);
router.get('/completePayOrder', WaiterController.completePayOrder);
router.get('/completeOrder', WaiterController.completeOrder);
router.post('/editOrder', WaiterController.editOrder);
router.get('/getOrderEdit', WaiterController.getOrderEdit);
router.get('/getOrder', WaiterController.getOrder);
router.post('/addOrder', WaiterController.addOrder);
router.get('/getFood', WaiterController.getFood);
router.get('/homeWaiter', WaiterController.homeWaiter);

module.exports = router;
