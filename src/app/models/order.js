const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const order = new Schema({
    dinnerTable: {type: String, unique: true},
    dinnerTableName: {type: String},
    orderId: {type: String, unique: true},
    note: { type: String},
    order: {type: Array},
    total: {type: Number},
    state: {type: String},
    staff: {type: Array},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('order', order);