const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  items: { 
    type: Array, 
    required: true 
  },
  method: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    default: 'Processando' // Status inicial do pedido
  },
  //vincula o pedido a um usuário logado
  // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);