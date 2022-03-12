const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookShip = new Schema({
    orderId: {type: String, unique: true},
    name: { type: String},
    phoneNumber: { type: String},
    address: { type: String},
    note: { type: String},
    order: {type: Array},
    total: {type: Number},
    state: {type: String},
    staff: {type: Array},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('bookShip', bookShip);