const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: String, default: '-0%' },
  category: { type: String, required: true },
  glow: { type: String, default: 'var(--primary)' }
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);