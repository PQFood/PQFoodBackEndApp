const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staff = new Schema({
    userName: { type: String, unique: true},
    password: { type: String},
    name: { type: String},
    position: { type: String},
    phoneNumber: { type: String},
    address: { type: String}, 
  },{
    timestamps: true,
  });

module.exports = mongoose.model('staff', staff);