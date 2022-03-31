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



class SiteController {

    async index(req, res, next) {
        res.json('pqfood')

    }


    async login(req, res, next) {
        var pass = sha256(req.body.password)

        var dataAdmin = await admin.findOne({ userName: req.body.user, password: pass })
        var dataStaff = await staff.findOne({ userName: req.body.user, password: pass })
        if (dataAdmin != null) {
            var data = {
                userName: dataAdmin.userName,
                position: "Chủ quán",
            }
            res.json(data)
        }
        else if (dataStaff != null) {
            var staffFind = await infoStaff.findOne({ userName: dataStaff.userName })
            var data = {
                userName: staffFind.userName,
                position: staffFind.position,
                name: staffFind.name
            }
            res.json(data)
        }
        else {
            res.json('Thất bại')
        }

    }

    



}

module.exports = new SiteController();
