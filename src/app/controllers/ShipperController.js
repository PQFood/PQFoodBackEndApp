const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 15 });
const idstaff = new ShortUniqueId({ length: 10 });
const sha256 = require('sha256');
const staff = require('../models/staff')
const infoStaff = require('../models/infoStaff')
const dinnerTable = require('../models/dinnerTable');
const order = require('../models/order');
const orderHistory = require('../models/orderHistory');
const warehouse = require('../models/warehouse');

const moment = require('moment');
const { query } = require('express');



class ShipperController {

    async homeShipper(req, res, next) {
        var bookshipFind = await bookShip.find({})
        var data = mutipleMongooseToObject(bookshipFind)
        for (var i = 0; i < bookshipFind.length; i++) {

            if (bookshipFind[i].state === "Chờ xác nhận") {
                data[i].color = "white"
            }
            if (bookshipFind[i].state === "Đã xác nhận" || bookshipFind[i].state === "Đang chế biến") {
                data[i].color = "orange"
            }
            if (bookshipFind[i].state === "Hoàn thành món") {
                data[i].color = "blue"
            }
            if (bookshipFind[i].state === "Đang giao") {
                data[i].color = "green"
            }

        }
        res.json(data)
    }

    async getBookShip(req,res,next){
        var result = await bookShip.findOne({orderId: req.query.orderId})
        res.json(result)
    }

    async confirmBookShip(req,res,next){
        var orderId = req.query.orderId
        var user = req.query.user
        var staffTemp = await infoStaff.findOne({ userName: user })
        var bookShipFind = await bookShip.findOne({ orderId: orderId })
        var staffNew = bookShipFind.staff;
        staffNew[staffNew.length] = {
            id: idstaff(),
            userName: staffTemp.userName,
            name: staffTemp.name,
            position: staffTemp.position,
            act: "Xác nhận hóa đơn",
        }
        var result = await bookShip.updateOne({ orderId: orderId }, {
            staff: staffNew,
            state: "Đã xác nhận"
        })
        if(result) res.json("ok")
        else res.json("error")

    }

    async deleteBookShip(req,res,next){
        var orderId = req.query.orderId
        var orderFind = await order.findOne({ orderId: slug })
        var orderHistoryNew = {}
        orderHistoryNew.dinnerTable = orderFind.dinnerTable
        orderHistoryNew.dinnerTableName = orderFind.dinnerTableName
        orderHistoryNew.orderId = orderFind.orderId
        orderHistoryNew.note = orderFind.note
        orderHistoryNew.order = orderFind.order
        orderHistoryNew.total = orderFind.total
        orderHistoryNew.state = "Đã hủy"
        orderHistoryNew.staff = orderFind.staff
        orderHistoryNew = new orderHistory(orderHistoryNew)
        var resultInsert = await orderHistoryNew.save()
        var resultDelete = await order.deleteOne({ orderId: slug })
        res.json(req.query.orderId)
    }



}

module.exports = new ShipperController();
