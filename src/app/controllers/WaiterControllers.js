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

const moment = require('moment')



class WaiterController {

    async homeWaiter(req, res, next) {
        var orderFind = await order.find({})
        var dinnerTableFind = await dinnerTable.find({})
        var data = []
        for (var i = 0; i < dinnerTableFind.length; i++) {
            var temp = ""
            for (var j = 0; j < orderFind.length; j++) {
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && orderFind[j].state === "Chờ thanh toán") {
                    temp = "luc"
                }
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Đang xử lý" || orderFind[j].state === "Đang chế biến")) {
                    temp = "cam"
                }
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Hoàn thành món")) {
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
    async getFood(req, res, next) {

        var dataFood = await foodMenu.find({ classify: 1 })
        var dataDrink = await foodMenu.find({ classify: 2 })
        var foodState = []
        var drinkState = []
        for (var i = 0; i < dataFood.length; i++) {
            foodState[i] = {
                quantity: 1,
                value: false,
                slug: dataFood[i].slug
            }
        }
        for (var i = 0; i < dataDrink.length; i++) {
            drinkState[i] = {
                quantity: 1,
                value: false,
                slug: dataDrink[i].slug
            }
        }
        var data = {
            food: dataFood,
            drink: dataDrink,
            foodState: foodState,
            drinkState: drinkState
        }
        res.json(data)

    }

    async addOrder(req, res, next) {
        var food = await req.body.food;
        var drink = await req.body.drink;

        var orderNew = new order();
        orderNew.dinnerTable = req.body.slugTable;
        orderNew.note = req.body.note;
        orderNew.total = req.body.total;
        orderNew.dinnerTableName = req.body.nameTable;
        orderNew.orderId = uid();
        orderNew.state = "Đang xử lý";
        var staffTemp = await infoStaff.findOne({ userName: req.body.staff })
        orderNew.staff = {
            id: idstaff(),
            userName: staffTemp.userName,
            name: staffTemp.name,
            position: staffTemp.position,
            act: "Thêm hóa đơn",
        }
        var index = 0
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
                orderNew.order[index] = orderTemp;
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
                orderNew.order[index] = orderTemp;
                index++;
            }
        }
        var result = await orderNew.save()
        if (result) res.json("ok")
        else res.json("error")
    }

    async getOrder(req, res, next) {
        var table = req.query.table
        var orderFind = await order.findOne({ dinnerTable: table })
        res.json(orderFind)
    }

    async getOrderEdit(req, res, next) {
        var table = req.query.table
        var dataFood = await foodMenu.find({ classify: 1 })
        var dataDrink = await foodMenu.find({ classify: 2 })
        var orderTable = await order.findOne({ dinnerTable: table })
        var foodState = []
        var drinkState = []
        for (var i = 0; i < dataFood.length; i++) {
            for (var j = 0; j < orderTable.order.length; j++) {
                if (orderTable.order[j].slug === dataFood[i].slug && orderTable.order[j].classify === 1) {
                    foodState[i] = {
                        quantity: orderTable.order[j].quantity,
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
            for (var j = 0; j < orderTable.order.length; j++) {
                if (orderTable.order[j].slug === dataDrink[i].slug && orderTable.order[j].classify === 2) {
                    drinkState[i] = {
                        quantity: orderTable.order[j].quantity,
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
            note: orderTable.note,
            total: orderTable.total
        }
        res.json(data)
    }

    async editOrder(req, res, next) {
        var food = await req.body.food;
        var drink = await req.body.drink;
        var orderFind = await order.findOne({ dinnerTable: req.body.slugTable });
        var staffTemp = await infoStaff.findOne({ userName: req.body.staff });
        var staffNew = orderFind.staff;
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
        var result = await order.updateOne({ dinnerTable: req.body.slugTable }, {
            order: orderUpdateTemp,
            staff: staffNew,
            note: req.body.note,
            total: req.body.total,
        })

        if (result) res.json("ok")
        else res.json("error")
    }

    async completeOrder(req, res, next) {
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
            state: "Chờ thanh toán"
        })
        if (result) res.json("ok")
        else res.json("error")
    }

    async completePayOrder(req, res, next) {
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
            act: "Thanh toán",
        }
        orderTable.staff = staffNew,
            orderTable.state = "Chờ xác nhận"
        var orderHistoryNew = new orderHistory()
        orderHistoryNew.order = orderTable.order
        orderHistoryNew.staff = orderTable.staff
        orderHistoryNew.dinnerTable = orderTable.dinnerTable
        orderHistoryNew.note = orderTable.note
        orderHistoryNew.total = orderTable.total
        orderHistoryNew.dinnerTableName = orderTable.dinnerTableName
        orderHistoryNew.orderId = orderTable.orderId
        orderHistoryNew.state = orderTable.state

        var result2 = await order.deleteOne({ dinnerTable: table })
        var result1 = await orderHistoryNew.save()

        if (result1 && result2) res.json("ok")
        else res.json("error")
    }

    async getBookTable(req, res, next) {
        var bookTableFind
        if (req.query.state === "all") {
            bookTableFind = await bookTable.find({ state: ["Hoàn thành", "Hủy"] }).sort({ time: 1 })
        }
        else{
            bookTableFind = await bookTable.find({ state: req.query.state }).sort({ time: 1 })
        }
        for (var i = 0; i < bookTableFind.length; i++) {
            bookTableFind[i]._doc.time = moment(bookTableFind[i].time).format("LT,L")
        }
        res.json(bookTableFind)
    }

    async confirmBookTable(req, res, next) {
        var result = await bookTable.updateOne({ _id: req.body.id }, {
            state: "Xác nhận"
        })
        if (result) res.json("ok")
        else res.json("error")
    }
    async cancelBookTable(req, res, next) {
        var result = await bookTable.updateOne({ _id: req.body.id }, {
            state: "Hủy"
        })
        if (result) res.json("ok")
        else res.json("error")
    }
    async completeBookTable(req, res, next) {
        var result = await bookTable.updateOne({ _id: req.body.id }, {
            state: "Hoàn thành"
        })
        if (result) res.json("ok")
        else res.json("error")
    }

    async getHistoryOrder(req,res,next){
        var quantity = req.query.quantity*4 //16
        var orderHistoryLength = await orderHistory.find({state: ["Đã hủy","Đã thanh toán"]})
        var result = await orderHistory.find({state: ["Đã hủy","Đã thanh toán"]}).limit(quantity)
        var full = false
        if(quantity >= orderHistoryLength.length) full = true
        var dataSend = {
            order: mutipleMongooseToObject(result),
            full: full
        }
        res.json(dataSend)
    }

    async getDetailOrder(req, res, next) {
        var orderId = req.query.orderId
        var orderFind = await orderHistory.findOne({ orderId: orderId })
        res.json(orderFind)
    }
    async changePassword(req,res,next){
        var passOldCheck = sha256(req.body.passOld)
        var passNew = sha256(req.body.passNew)
        var result = await staff.findOne({userName : req.body.user, password: passOldCheck})
        if(result) {
            var resultUpdate = await staff.updateOne({userName : req.body.user},{
                password: passNew
            })
            if(resultUpdate) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        else {
            res.json("incorrect")
        }
    }

}

module.exports = new WaiterController();
