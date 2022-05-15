const admin = require('../models/admin');
const sha256 = require('sha256');
const staff = require('../models/staff')


class SiteController {

    async index(req, res, next) {
        res.json('pqfood')

    }

    async login(req, res, next) {
        try {
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
                var staffFind = await staff.findOne({ userName: dataStaff.userName })
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
        catch (err) {
            console.log(err)
        }

    }





}

module.exports = new SiteController();
