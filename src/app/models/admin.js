const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin = new Schema({
    userName: { type: String, unique: true},
    password: { type: String},
  },{
    timestamps: true,
  });

module.exports = mongoose.model('admin', admin);