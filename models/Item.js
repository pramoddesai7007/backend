// models/item.js

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    enum: ['KG', 'NOs', 'Litre', 'box', 'carton'], // You can customize this based on your specific units
    required: true,
  },
  stockQty: { type: Number, default: 0 }, // Add this line
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
