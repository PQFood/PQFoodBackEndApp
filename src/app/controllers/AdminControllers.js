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
            const foodNew = new foodMenu(req.body)
            var resultUpload = await foodNew.save()
            if (resultUpload) {
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
    async listFood(req, res, next) {
        try {
            var food = await foodMenu.find({ classify: 1 })
            res.json(food)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async deleteFood(req, res, next) {
        try {
            var slug = await req.body.slug
            var result = await foodMenu.delete({ slug: slug })
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
    async getInfoFood(req, res, next) {
        try {
            var foodFind = await foodMenu.findOne({ slug: req.query.slug })
            res.json(foodFind)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async editFoodMenu(req, res, next) {
        try {
            var result = await foodMenu.updateOne({ slug: req.body.slug }, {
                name: req.body.name,
                price: parseInt(req.body.price),
                image: req.body.image,
                classify: parseInt(req.body.classify),
                description: req.body.description,
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
    async listDrink(req, res, next) {
        try {
            var drink = await foodMenu.find({ classify: 2 })
            res.json(drink)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async listBinMenu(req, res, next) {
        try {
            var result = await foodMenu.findDeleted({})
            res.json(result)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async deleteMenu(req, res, next) {
        try {
            var slug = await req.body.slug
            var result = await foodMenu.deleteOne({ slug: slug })
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
    async restoreMenu(req, res, next) {
        try {
            var slug = await req.body.slug
            var result = await foodMenu.restore({ slug: slug })
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
    async addWarehouse(req, res, next) {
        try {
            const warehouseNew = new warehouse(req.body);
            var result = await warehouseNew.save()
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
    async deleteWarehouse(req, res, next) {
        try {
            var result = await warehouse.deleteOne({ slug: req.body.slug })
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
    async editWarehouse(req, res, next) {
        try {
            var slug = req.body.slug
            var result = await warehouse.updateOne({ slug: slug }, {
                name: req.body.name,
                unit: req.body.unit,
                quantity: req.body.quantity,
                providerName: req.body.providerName,
                providerPhoneNumber: req.body.providerPhoneNumber,
                providerAddress: req.body.providerAddress,
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
    async dayRevenue(req, res, next) {
        try {
            var timeRevenue = moment(req.query.dayRevenue).startOf('day')
            var data = await orderHistory.find({
                updatedAt: {
                    $gte: timeRevenue.toDate(),
                    $lte: moment(timeRevenue).endOf('day').toDate()
                },
                state: "Đã thanh toán"
            })
            var total = 0
            for (var i = 0; i < data.length; i++) {
                total = total + data[i].total
            }

            var dataShip = await shipHistory.find({
                updatedAt: {
                    $gte: timeRevenue.toDate(),
                    $lte: moment(timeRevenue).endOf('day').toDate()
                },
                state: "Đã hoàn thành"
            })

            for (var i = 0; i < dataShip.length; i++) {
                total = total + dataShip[i].total
            }
            res.json(total)
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }
    async weekRevenue(req, res, next) {
        try {
            var todayWeek = moment(req.query.timeRevenue).startOf('day')

            var arrDay = []
            var dem = 0

            for (var i = todayWeek.isoWeekday() - 1; i > 0; i--) {
                var temp = moment(todayWeek)
                arrDay[dem] = temp.subtract(i, 'days')
                dem++
            }

            arrDay[dem] = todayWeek
            dem++

            for (var i = 1; i <= 7 - todayWeek.isoWeekday(); i++) {
                var temp = moment(todayWeek)
                arrDay[dem] = temp.add(i, 'days')
                dem++
            }

            var arrTotal = []
            var totalWeek = 0
            for (var i = 0; i < 7; i++) {
                var dayFind = arrDay[i]
                var data = await orderHistory.find({
                    updatedAt: {
                        $gte: dayFind.startOf('day').toDate(),
                        $lte: moment(dayFind).endOf('day').toDate()
                    },
                    state: "Đã thanh toán"
                })

                var totalTempWeek = 0

                for (var j = 0; j < data.length; j++) {
                    totalTempWeek = totalTempWeek + data[j].total
                }

                var dataShip = await shipHistory.find({
                    updatedAt: {
                        $gte: dayFind.startOf('day').toDate(),
                        $lte: moment(dayFind).endOf('day').toDate()
                    },
                    state: "Đã hoàn thành"
                })

                for (var j = 0; j < dataShip.length; j++) {
                    totalTempWeek = totalTempWeek + dataShip[j].total
                }
                totalWeek = totalWeek + totalTempWeek
                arrTotal[i] = totalTempWeek
            }

            for (var i = 0; i < 7; i++) {
                arrDay[i] = arrDay[i].format('DD/MM');
            }
            res.json({
                arrDay: arrDay,
                arrTotal: arrTotal,
                totalWeek: totalWeek
            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async monthRevenue(req, res, next) {
        try {
            var date = new Date(req.query.timeRevenue)
            var year = date.getFullYear()
            var arr = []
            var totalYear = 0
            for (var i = 1; i <= 12; i++) {
                var currentDate = moment(year + '-' + i, 'YYYY-MM')
                var orders = await orderHistory.find({
                    updatedAt: {
                        $gte: currentDate.startOf('month').toDate(),
                        $lte: moment(currentDate).endOf('month').toDate()
                    },
                    state: "Đã thanh toán"
                })
                var temp = 0
                for (var j = 0; j < orders.length; j++) {
                    temp = temp + orders[j].total
                }

                var ships = await shipHistory.find({
                    updatedAt: {
                        $gte: currentDate.toDate(),
                        $lte: moment(currentDate).endOf('month').toDate()
                    },
                    state: "Đã hoàn thành"
                })
                for (var j = 0; j < ships.length; j++) {
                    temp = temp + ships[j].total
                }
                totalYear = totalYear + temp
                arr[i - 1] = temp
            }
            res.json({
                totalYear: totalYear,
                arrMonth: arr
            })
        }
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

    async changePassword(req, res, next) {
        try {
            var passOldCheck = sha256(req.body.passOld)
            var passNew = sha256(req.body.passNew)
            var result = await admin.findOne({ userName: req.body.user, password: passOldCheck })
            if (result) {
                var resultUpdate = await admin.updateOne({ userName: req.body.user }, {
                    password: passNew
                })
                if (resultUpdate) {
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
        catch (err) {
            res.json("error")
            console.log(err)
        }
    }

}

module.exports = new SiteController();
