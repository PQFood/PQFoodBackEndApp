const admin = require('../models/admin');
const cloudinary = require('cloudinary').v2
const foodMenu = require('../models/foodMenu');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { MongooseToObject } = require('../../util/mongoose');
const sha256 = require('sha256');
const staff = require('../models/staff');
const dinnerTable = require('../models/dinnerTable');
const warehouse = require('../models/warehouse');
const order = require('../models/order');
const orderHistory = require('../models/orderHistory');
const shipHistory = require('../models/shipHistory');
const bookShip = require('../models/bookShip');
const moment = require('moment')





class SiteController {

    async adminGetOrder(req, res, next) {
        try {
            var waitConfirm = await orderHistory.find({ state: "Chờ xác nhận" }).sort({ updatedAt: 1 })
            res.json(waitConfirm)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async adminGetShip(req, res, next) {
        try {
            var waitConfirm = await shipHistory.find({ state: "Chờ xác nhận" }).sort({ updatedAt: 1 })
            res.json(waitConfirm)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async adminCancelOrder(req, res, next) {
        try {
            var result = await orderHistory.updateOne({ orderId: req.body.orderId }, {
                state: "Đã hủy"
            })
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async adminConfirmOrder(req, res, next) {
        try {
            var result = await orderHistory.updateOne({ orderId: req.body.orderId }, {
                state: "Đã thanh toán"
            })
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async adminCancelShip(req, res, next) {
        try {
            var result = await shipHistory.updateOne({ orderId: req.body.orderId }, {
                state: "Đã hủy"
            })
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async adminConfirmShip(req, res, next) {
        try {
            var result = await shipHistory.updateOne({ orderId: req.body.orderId }, {
                state: "Đã hoàn thành"
            })
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async adminGetOrderCurrent(req, res, next) {
        try {
            var OrderCurrent = await order.find({})
            res.json(OrderCurrent)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async adminGetShipCurrent(req, res, next) {
        try {
            var OrderCurrent = await bookShip.find({})
            res.json(OrderCurrent)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async getDetailOrderCurrent(req, res, next) {
        try {
            var orderId = req.query.orderId
            var orderFind = await order.findOne({ orderId: orderId })
            res.json(orderFind)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async getDetailShipCurrent(req, res, next) {
        try {
            var orderId = req.query.orderId
            var orderFind = await bookShip.findOne({ orderId: orderId })
            res.json(orderFind)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async cancelOrder(req, res, next) {
        try {
            var orderId = req.body.orderId
            var orderTable = await order.findOne({ orderId: orderId })

            var orderHistoryNew = new orderHistory()
            orderHistoryNew.order = orderTable.order
            orderHistoryNew.staff = orderTable.staff
            orderHistoryNew.dinnerTable = orderTable.dinnerTable
            orderHistoryNew.note = orderTable.note
            orderHistoryNew.total = orderTable.total
            orderHistoryNew.dinnerTableName = orderTable.dinnerTableName
            orderHistoryNew.orderId = orderTable.orderId
            orderHistoryNew.state = "Đã hủy"
            orderHistoryNew.reason = "Chủ quán hủy"
            var result2 = await order.deleteOne({ orderId: orderId })
            var result1 = await orderHistoryNew.save()

            if (result1 && result2) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async cancelBookShip(req, res, next) {
        try {
            var orderId = req.body.orderId

            var bookShipFind = await bookShip.findOne({ orderId: orderId })
            var bookShipHistoryNew = {}
            bookShipHistoryNew.orderId = bookShipFind.orderId
            bookShipHistoryNew.note = bookShipFind.note
            bookShipHistoryNew.order = bookShipFind.order
            bookShipHistoryNew.total = bookShipFind.total
            bookShipHistoryNew.state = "Đã hủy"
            bookShipHistoryNew.staff = bookShipFind.staff
            bookShipHistoryNew.phoneNumber = bookShipFind.phoneNumber
            bookShipHistoryNew.name = bookShipFind.name
            bookShipHistoryNew.address = bookShipFind.address
            bookShipHistoryNew.reason = "Chủ quán hủy"

            bookShipHistoryNew = new shipHistory(bookShipHistoryNew)
            var resultDelete = await bookShip.deleteOne({ orderId: orderId })
            var resultInsert = await bookShipHistoryNew.save()
            if (resultInsert && resultDelete) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }

    }

    async listStaff(req, res, next) {
        try {
            var infoStaffFind = await staff.find({})
            res.json(infoStaffFind)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async deleteStaff(req, res, next) {
        try {
            var slug = req.body.slug
            var resultStaff = await staff.deleteOne({ userName: slug })
            if (resultStaff) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async checkStaffExist(req, res, next) {
        try {
            var data = await staff.findOne({ userName: req.query.userName })
            var data2 = await admin.findOne({ userName: req.query.userName })
            if (data != null || data2 != null) {
                res.json(false)
            }
            else {
                res.json(true)
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async addStaff(req, res, next) {
        try {
            var pass = sha256(req.body.password)
            const staffNew = new staff(req.body)
            staffNew.password = pass
            //add
            var resultUploadStaff = await staffNew.save()
            if (resultUploadStaff) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async getInfoStaff(req, res, next) {
        try {
            var result = await staff.findOne({ userName: req.query.userName })
            res.json(result)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async editStaff(req, res, next) {
        try {
            var result = await staff.updateOne({ userName: req.body.userNameStaff }, {
                name: req.body.name,
                phoneNumber: req.body.phoneNumber,
                address: req.body.address,
                position: req.body.position,
            })
            if (result) res.json("ok")
            else res.json("error")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async getDinnerTable(req, res, next) {
        try {
            var result = await dinnerTable.find({})
            res.json(result)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async addDinnerTable(req, res, next) {
        try {
            const tableNew = new dinnerTable(req.body)
            var result = await tableNew.save()
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }


    async deleteDinnerTable(req, res, next) {
        try {
            var slug = req.body.slug
            var result = await dinnerTable.deleteOne({ slug: slug })
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async getInfoDinnerTable(req, res, next) {
        try {
            var result = await dinnerTable.findOne({ slug: req.query.slug })
            res.json(result)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async editDinnerTable(req, res, next) {
        try {
            var slug = req.body.slug
            var result = await dinnerTable.updateOne({ slug: slug }, {
                name: req.body.name,
                description: req.body.description,
                quantity: req.body.quantity,
            })
            if (result) {
                res.json("ok")
            }
            else {
                res.json("error")
            }
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async addFoodMenu(req, res, next) {
        try {
            await cloudinary.uploader.upload(req.body.image,
                {
                    folder: 'pqfood',
                    use_filename: true
                },
                function (error, result) {
                    console.log(result)
                });
            // console.log(req.body.image)
            res.json("ok")
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }


}

module.exports = new SiteController();
