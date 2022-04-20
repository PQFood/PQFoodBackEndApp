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



class ChefController {

    async homeChef(req, res, next) {
        try {
            var orderFind = await order.find({})
            var dinnerTableFind = await dinnerTable.find({})
            var data = []
            for (var i = 0; i < dinnerTableFind.length; i++) {
                var temp = ""
                for (var j = 0; j < orderFind.length; j++) {
                    if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Chờ thanh toán" || orderFind[j].state === "Hoàn thành món")) {
                        temp = "luc"
                    }
                    if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Đang xử lý")) {
                        temp = "cam"
                    }
                    if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Đang chế biến")) {
                        temp = "duong"
                    }
                }
                if (temp === "") {
                    data[i] = {
                        nameTable: dinnerTableFind[i].name,
                        color: "White",
                        slug: dinnerTableFind[i].slug
                    }
                }
                else if (temp === "luc") {
                    data[i] = {
                        nameTable: dinnerTableFind[i].name,
                        color: "Green",
                        slug: dinnerTableFind[i].slug
                    }
                }
                else if (temp === "duong") {
                    data[i] = {
                        nameTable: dinnerTableFind[i].name,
                        color: "Blue",
                        slug: dinnerTableFind[i].slug
                    }
                }
                else {
                    data[i] = {
                        nameTable: dinnerTableFind[i].name,
                        color: "Orange",
                        slug: dinnerTableFind[i].slug
                    }
                }
            }
            res.json(data)
        }
        catch (err) {
            console.log(err)
        }
    }


    async ConfirmOrder(req, res, next) {
        try {
            var table = req.query.table
            var user = req.query.user
            var staffTemp = await infoStaff.findOne({ userName: user })
            var orderTable = await order.findOne({ dinnerTable: table })
            var staffNew = orderTable.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Xác nhận hóa đơn",
            }
            var result = await order.updateOne({ dinnerTable: table }, {
                staff: staffNew,
                state: "Đang chế biến"
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async deleteOrder(req, res, next) {
        try {
            var table = req.query.table
            var user = req.query.user
            var reason = req.query.reason
            var staffTemp = await infoStaff.findOne({ userName: user })
            var orderTable = await order.findOne({ dinnerTable: table })
            var staffNew = orderTable.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Hủy hóa đơn",
            }
            orderTable.staff = staffNew
            orderTable.state = "Đã hủy"
            var orderHistoryNew = new orderHistory()
            orderHistoryNew.order = orderTable.order
            orderHistoryNew.staff = orderTable.staff
            orderHistoryNew.dinnerTable = orderTable.dinnerTable
            orderHistoryNew.note = orderTable.note
            orderHistoryNew.total = orderTable.total
            orderHistoryNew.dinnerTableName = orderTable.dinnerTableName
            orderHistoryNew.orderId = orderTable.orderId
            orderHistoryNew.state = orderTable.state
            orderHistoryNew.reason = reason
            var result2 = await order.deleteOne({ dinnerTable: table })
            var result1 = await orderHistoryNew.save()

            if (result1 && result2) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async getNote(req, res, next) {
        try {
            var orderTable = await order.findOne({ dinnerTable: req.query.table })
            res.json(orderTable.note)
        }
        catch (err) {
            console.log(err)
        }
    }

    async setNote(req, res, next) {
        try {
            var orderTable = await order.findOne({ dinnerTable: req.body.table })
            var staffTemp = await infoStaff.findOne({ userName: req.body.user })

            var staffNew = orderTable.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Thông báo",
            }
            var result = await order.updateOne({ dinnerTable: req.body.table }, {
                note: req.body.note,
                staff: staffNew
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async completeOrder(req, res, next) {
        try {
            var table = req.query.table
            var user = req.query.user
            var staffTemp = await infoStaff.findOne({ userName: user })
            var orderTable = await order.findOne({ dinnerTable: table })
            var staffNew = orderTable.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Hoàn thành món",
            }

            var result = await order.updateOne({ dinnerTable: table }, {
                staff: staffNew,
                state: "Hoàn thành món"
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async getWarehouse(req, res, next) {
        try {
            var result = await warehouse.find({})
            res.json(result)
        }
        catch (err) {
            console.log(err)
        }
    }

    async getOneWarehouse(req, res, next) {
        try {
            var result = await warehouse.findOne({ slug: req.query.slug })
            res.json(result)
        }
        catch (err) {
            console.log(err)
        }
    }
    async changeQuantityWarehouse(req, res, next) {
        try {
            var quantityChange = parseFloat(req.body.quantity)
            var result = await warehouse.updateOne({ slug: req.body.slug }, {
                quantity: quantityChange
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async chefBookShip(req, res, next) {
        try {
            var bookshipFind = await bookShip.find({})
            var data = mutipleMongooseToObject(bookshipFind)
            for (var i = 0; i < bookshipFind.length; i++) {

                if (bookshipFind[i].state === "Chờ xác nhận") {
                    data[i].color = "white"
                }
                if (bookshipFind[i].state === "Đã xác nhận") {
                    data[i].color = "orange"
                }
                if (bookshipFind[i].state === "Đang chế biến") {
                    data[i].color = "blue"
                }
                if (bookshipFind[i].state === "Đang giao" || bookshipFind[i].state === "Hoàn thành món") {
                    data[i].color = "green"
                }

            }
            res.json(data)
        }
        catch (err) {
            console.log(err)
        }
    }

    async confirmBookShip(req, res, next) {
        try {
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
                state: "Đang chế biến"
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async completeBookShip(req, res, next) {
        try {
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
                act: "Hoàn thành món",
            }
            var result = await bookShip.updateOne({ orderId: orderId }, {
                staff: staffNew,
                state: "Hoàn thành món"
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

}

module.exports = new ChefController();
