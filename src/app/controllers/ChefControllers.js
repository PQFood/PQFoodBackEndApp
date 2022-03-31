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



class ChefController {

    async homeChef(req, res, next) {
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


    async ConfirmOrder(req, res, next) {
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
        if(result) res.json("ok")
        else res.json("error")
    }
    async deleteOrder(req,res,next){
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
            act: "Hủy hóa đơn",
        }
        orderTable.staff = staffNew,
        orderTable.state = "Đã hủy"
        orderTable._id = ""
        // var orderHistoryNew = new orderHistory(orderTable)
        // var result2 = await order.deleteOne({dinnerTable: table})
        // var result1 = await orderHistoryNew.save()

        // if(result1 && result2) res.json("ok")
        // else res.json("error")
        res.json(orderTable)

    }

}

module.exports = new ChefController();
