const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const infoStaff = new Schema({
    userName: { type: String, unique: true},
    name: { type: String},
    position: { type: String},
    phoneNumber: { type: String},
    address: { type: String}, 
  },{
    timestamps: true,
  });

module.exports = mongoose.model('infoStaff', infoStaff);