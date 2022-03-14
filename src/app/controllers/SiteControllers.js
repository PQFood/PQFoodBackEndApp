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
const moment = require('moment')



class SiteController {

    async index(req, res, next) {
        res.json('pqfood')

    }


    async login(req, res, next) {
        var pass = sha256(req.body.password)

        var dataAdmin = await admin.findOne({ userName: req.body.user, password: pass })
        var dataStaff = await staff.findOne({ userName: req.body.user, password: pass })
        if(dataAdmin != null){
            res.json(dataAdmin)
        }
        else if(dataStaff != null){
            res.json(dataStaff)
        }
        else {
            res.json('Thất bại')
        }
        
    }



    


}

module.exports = new SiteController();
