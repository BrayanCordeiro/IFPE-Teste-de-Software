const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  glow: { type: String, default: 'var(--primary)' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);