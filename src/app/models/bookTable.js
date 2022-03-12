const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookTable = new Schema({
    name: { type: String},
    phoneNumber: { type: String},
    time: { type: Date},
    quantity: { type: Number},
    note: { type: String},
    state: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('bookTable', bookTable);