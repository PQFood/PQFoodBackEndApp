const admin = require('../models/admin');
const bookTable = require('../models/bookTable');
const bookShip = require('../models/bookShip');
const { mutipleMongooseToObject } = require('../../util/mongoose')
const { MongooseToObject } = require('../../util/mongoose')
const foodMenu = require('../models/foodMenu');
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId({ length: 15 });
const sha256 = require('sha256');
const moment = require('moment')



class SiteController {

    async index(req, res, next) {
        var menuFoods = await foodMenu.find({ classify: 1 })
        var menuFoodLimit = await foodMenu.find({ classify: 1 }).limit(8)
        var menuDrinks = await foodMenu.find({ classify: 2 })

        res.json(menuFoods)

    }


    async login(req, res, next) {
        var pass = sha256(req.body.passwordLogin)

        var data = await admin.findOne({ userName: req.body.userLogin, password: pass })
        if (data != null) {
            req.session.message = {
                type: 'success',
                intro: 'Chúc mừng bạn đăng nhập thành công!',
                message: ''
            }
            res.cookie('adminId', data.id, {
                signed: true,
                maxAge: 1000 * 60 * 60 * 2
            })
            res.redirect('/admin')
        }
        else {
            req.session.message = {
                type: 'warning',
                intro: 'Đăng nhập thất bại!',
                message: 'Vui lòng đăng nhập lại!',
                show: 'show ne'
            }
            res.redirect('back')
        }
    }



    

    async thu(req,res,next){
        res.json(req.body)
    }

}

module.exports = new SiteController();
