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
            if(temp === ""){
                data[i] = {
                    nameTable : dinnerTableFind[i].name,
                    color : "White",
                    slug : dinnerTableFind[i].slug
                }
            }
            else if(temp === "xanh"){
                data[i] = {
                    nameTable : dinnerTableFind[i].name,
                    color : "Green",
                    slug : dinnerTableFind[i].slug
                }
            }
            else {
                data[i] = {
                    nameTable : dinnerTableFind[i].name,
                    color : "Orange",
                    slug : dinnerTableFind[i].slug
                }
            }
        }
        res.json(data)
    }
    async getFood(req, res, next) {

        var dataFood = await foodMenu.find({ classify: 1 })
        var dataDrink = await foodMenu.find({ classify: 2 })
        var data = {
            food: dataFood,
            drink: dataDrink
        }
        res.json(data)        

    }



}

module.exports = new WaiterController();
