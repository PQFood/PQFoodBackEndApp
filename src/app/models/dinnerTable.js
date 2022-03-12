const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const dinnerTable = new Schema({
    name: { type: String},
    quantity: { type: Number},
    description: {type: String},
    slug: { type: String, slug: 'name', unique: true },
  },{
    timestamps: true,
  });

mongoose.plugin(slug);


module.exports = mongoose.model('dinnerTable', dinnerTable);