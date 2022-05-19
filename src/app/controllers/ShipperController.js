const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 15 });
const idstaff = new ShortUniqueId({ length: 10 });
const staff = require('../models/staff')
const shipHistory = require('../models/shipHistory');
const moment = require('moment');
const { query } = require('express');



class ShipperController {

    async homeShipper(req, res, next) {
        try {
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
        catch (err) {
            console.log(err)
        }
    }

    async getBookShip(req, res, next) {
        try {
            var result = await bookShip.findOne({ orderId: req.query.orderId })
            res.json(result)
        }
        catch (err) {
            console.log(err)
        }
    }
    async getBookShipHistoryElement(req, res, next) {
        try {
            var result = await shipHistory.findOne({ orderId: req.query.orderId })
            res.json(result)
        }
        catch (err) {
            console.log(err)
        }
    }

    async confirmBookShip(req, res, next) {
        try {
            var orderId = req.query.orderId
            var user = req.query.user
            var staffTemp = await staff.findOne({ userName: user })
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
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async deleteBookShip(req, res, next) {
        try {
            var orderId = req.query.orderId
            var user = req.query.user
            var reason = req.query.reason
            var bookShipFind = await bookShip.findOne({ orderId: orderId })
            var staffTemp = await staff.findOne({ userName: user })
            var staffNew = bookShipFind.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Hủy hóa đơn",
            }
            var bookShipHistoryNew = {}
            bookShipHistoryNew.orderId = bookShipFind.orderId
            bookShipHistoryNew.note = bookShipFind.note
            bookShipHistoryNew.order = bookShipFind.order
            bookShipHistoryNew.total = bookShipFind.total
            bookShipHistoryNew.state = "Đã hủy"
            bookShipHistoryNew.staff = staffNew
            bookShipHistoryNew.phoneNumber = bookShipFind.phoneNumber
            bookShipHistoryNew.name = bookShipFind.name
            bookShipHistoryNew.address = bookShipFind.address
            bookShipHistoryNew.reason = reason
            
            bookShipHistoryNew = new shipHistory(bookShipHistoryNew)
            var resultInsert = await bookShipHistoryNew.save()
            var resultDelete = await bookShip.deleteOne({ orderId: orderId })
            if (resultInsert && resultDelete) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async getBookShipEdit(req, res, next) {
        try {
            var orderId = req.query.orderId
            var dataFood = await foodMenu.find({ classify: 1 })
            var dataDrink = await foodMenu.find({ classify: 2 })
            var bookShipFind = await bookShip.findOne({ orderId: orderId })
            var foodState = []
            var drinkState = []
            for (var i = 0; i < dataFood.length; i++) {
                for (var j = 0; j < bookShipFind.order.length; j++) {
                    if (bookShipFind.order[j].slug === dataFood[i].slug && bookShipFind.order[j].classify === 1) {
                        foodState[i] = {
                            quantity: bookShipFind.order[j].quantity,
                            value: true,
                            slug: dataFood[i].slug
                        }
                        break
                    }
                    else {
                        foodState[i] = {
                            quantity: 1,
                            value: false,
                            slug: dataFood[i].slug
                        }
                    }
                }

            }
            for (var i = 0; i < dataDrink.length; i++) {
                for (var j = 0; j < bookShipFind.order.length; j++) {
                    if (bookShipFind.order[j].slug === dataDrink[i].slug && bookShipFind.order[j].classify === 2) {
                        drinkState[i] = {
                            quantity: bookShipFind.order[j].quantity,
                            value: true,
                            slug: dataDrink[i].slug
                        }
                        break
                    }
                    else {
                        drinkState[i] = {
                            quantity: 1,
                            value: false,
                            slug: dataDrink[i].slug
                        }
                    }
                }

            }
            var data = {
                food: dataFood,
                drink: dataDrink,
                foodState: foodState,
                drinkState: drinkState,
                note: bookShipFind.note,
                total: bookShipFind.total,
                name: bookShipFind.name,
                phoneNumber: bookShipFind.phoneNumber,
                address: bookShipFind.address,
            }
            res.json(data)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async editBookShip(req, res, next) {
        try {
            var food = await req.body.food;
            var drink = await req.body.drink;
            var bookShipFind = await bookShip.findOne({ orderId: req.body.orderId });
            var staffTemp = await staff.findOne({ userName: req.body.staff });
            var staffNew = bookShipFind.staff;
            var index = 0;
            var orderUpdateTemp = [];

            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Cập nhật hóa đơn",
            }
            for (var i = 0; i < food.length; i++) {
                if (food[i].value === true) {
                    var foodFind = await foodMenu.findOne({ slug: food[i].slug })
                    var orderTemp = {}
                    orderTemp.name = foodFind.name
                    orderTemp.price = foodFind.price
                    orderTemp.classify = foodFind.classify
                    orderTemp.description = foodFind.description
                    orderTemp.image = foodFind.image
                    orderTemp.slug = foodFind.slug
                    orderTemp.quantity = food[i].quantity
                    orderUpdateTemp[index] = orderTemp;
                    index++;
                }
            }
            for (var i = 0; i < drink.length; i++) {
                if (drink[i].value === true) {
                    var drinkFind = await foodMenu.findOne({ slug: drink[i].slug })
                    var orderTemp = {}
                    orderTemp.name = drinkFind.name
                    orderTemp.price = drinkFind.price
                    orderTemp.classify = drinkFind.classify
                    orderTemp.description = drinkFind.description
                    orderTemp.image = drinkFind.image
                    orderTemp.slug = drinkFind.slug
                    orderTemp.quantity = drink[i].quantity
                    orderUpdateTemp[index] = orderTemp;
                    index++;
                }
            }

            var result = await bookShip.updateOne({ orderId: req.body.orderId }, {
                order: orderUpdateTemp,
                staff: staffNew,
                note: req.body.note,
                total: req.body.total,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,

            })

            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async receiveBookShip(req, res, next) {
        try {
            var orderId = req.query.orderId
            var user = req.query.user
            var staffTemp = await staff.findOne({ userName: user })
            var bookShipFind = await bookShip.findOne({ orderId: orderId })
            var staffNew = bookShipFind.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Nhận món",
            }
            var result = await bookShip.updateOne({ orderId: orderId }, {
                staff: staffNew,
                state: "Đang giao"
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
            var bookShipFind = await bookShip.findOne({ orderId: orderId })
            var staffTemp = await staff.findOne({ userName: user })
            var staffNew = bookShipFind.staff;
            staffNew[staffNew.length] = {
                id: idstaff(),
                userName: staffTemp.userName,
                name: staffTemp.name,
                position: staffTemp.position,
                act: "Hủy hóa đơn",
            }
            var bookShipHistoryNew = {}
            bookShipHistoryNew.orderId = bookShipFind.orderId
            bookShipHistoryNew.note = bookShipFind.note
            bookShipHistoryNew.order = bookShipFind.order
            bookShipHistoryNew.total = bookShipFind.total
            bookShipHistoryNew.state = "Chờ xác nhận"
            bookShipHistoryNew.staff = staffNew
            bookShipHistoryNew.phoneNumber = bookShipFind.phoneNumber
            bookShipHistoryNew.name = bookShipFind.name
            bookShipHistoryNew.address = bookShipFind.address

            bookShipHistoryNew = new shipHistory(bookShipHistoryNew)
            var resultInsert = await bookShipHistoryNew.save()
            var resultDelete = await bookShip.deleteOne({ orderId: orderId })
            if (resultInsert && resultDelete) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async getBookShipHistory(req, res, next) {
        try {
            var quantity = req.query.quantity * 4 //16
            var orderHistoryLength = await shipHistory.find({ state: ["Đã hủy", "Đã hoàn thành"] })
            var result = await shipHistory.find({ state: ["Đã hủy", "Đã hoàn thành"] }).sort({updatedAt: -1}).limit(quantity)
            var full = false
            if (quantity >= orderHistoryLength.length) full = true
            var dataSend = {
                order: mutipleMongooseToObject(result),
                full: full
            }
            res.json(dataSend)
        }
        catch (err) {
            console.log(err)
        }
    }
    async getShipSearch(req,res,next){
        try{
            var shipHistoriySearch = await shipHistory.find({ orderId: new RegExp('.*' + req.query.search + '.*') }).sort({ updatedAt: -1 })
            res.json(shipHistoriySearch)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

}

module.exports = new ShipperController();
