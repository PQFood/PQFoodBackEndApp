const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 15 });
const sha256 = require('sha256');
const staff = require('../models/staff')
const infoStaff = require('../models/infoStaff')
const dinnerTable = require('../models/dinnerTable');
const order = require('../models/order');

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
                    temp = "xanh"
                }
                if (dinnerTableFind[i].slug === orderFind[j].dinnerTable && (orderFind[j].state === "Đang xử lý" || orderFind[j].state === "Hoàn thành món")) {
                    temp = "cam"
                }
            }
            if (temp === "") {
                data[i] = {
                    nameTable: dinnerTableFind[i].name,
                    color: "White",
                    slug: dinnerTableFind[i].slug
                }
            }
            else if (temp === "xanh") {
                data[i] = {
                    nameTable: dinnerTableFind[i].name,
                    color: "Green",
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
        orderNew.staff = await infoStaff.findOne({ userName: req.body.staff })
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
        if(result) res.json("ok")
        else res.json("error")
    }



}

module.exports = new WaiterController();
