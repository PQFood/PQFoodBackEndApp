const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');

const warehouse = new Schema({
    name: { type: String},
    quantity: { type: mongoose.Types.Decimal128},
    unit: {type: String},
    providerName: {type: String},
    providerPhoneNumber: {type: String},
    providerAddress: {type: String},
    slug: { type: String, slug: 'name', unique: true },
  },{
    timestamps: true,
  });

mongoose.plugin(slug);
warehouse.plugin(mongooseDelete, { 
  deletedAt : true,
  overrideMethods: 'all' 
});

module.exports = mongoose.model('warehouse', warehouse);