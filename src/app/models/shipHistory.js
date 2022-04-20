const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shipHistory = new Schema({
    orderId: {type: String, unique: true},
    name: { type: String},
    phoneNumber: { type: String},
    address: { type: String},
    note: { type: String},
    order: {type: Array},
    total: {type: Number},
    state: {type: String},
    staff: {type: Array},
    reason: {type: String}
  },{
    timestamps: true,
  });

module.exports = mongoose.model('shipHistory', shipHistory);