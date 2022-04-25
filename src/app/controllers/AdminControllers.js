const admin = require('../models/admin');
const cloudinary = require('cloudinary').v2
const foodMenu = require('../models/foodMenu');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const sha256 = require('sha256');
const staff = require('../models/staff');
const infoStaff = require('../models/infoStaff');
const dinnerTable = require('../models/dinnerTable');
const warehouse = require('../models/warehouse');
const order = require('../models/order');
const orderHistory = require('../models/orderHistory');
const shipHistory = require('../models/shipHistory');
const bookShip = require('../models/bookShip');
const moment = require('moment')





class SiteController {

    async adminGetOrder(req,res,next){
        try{
            var waitConfirm = await orderHistory.find({ state: "Chờ xác nhận" }).sort({ updatedAt: 1 })
            res.json(waitConfirm)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async adminGetShip(req,res,next){
        try{
            var waitConfirm = await shipHistory.find({ state: "Chờ xác nhận" }).sort({ updatedAt: 1 })
            res.json(waitConfirm)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async adminCancelOrder(req,res,next){
        try{
            var result = await orderHistory.updateOne({orderId: req.body.orderId},{
                state: "Đã hủy"
            })
            if(result){
                res.json("ok")
            }
            else{
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async adminConfirmOrder(req,res,next){
        try{
            var result = await orderHistory.updateOne({orderId: req.body.orderId},{
                state: "Đã thanh toán"
            })
            if(result){
                res.json("ok")
            }
            else{
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    

}

module.exports = new SiteController();
