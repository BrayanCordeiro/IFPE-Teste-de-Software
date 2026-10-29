const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/checkout', async (req, res) => {
  try {
    const { cart, method } = req.body;
    
    if (!cart || cart.length === 0) {
      return res.status(400).json({ error: 'O carrinho está vazio' });
    }

    const orderId = 'NX-' + Math.floor(Math.random() * 1000000);

    const newOrder = await Order.create({
      orderId,
      items: cart,
      method
    });

    res.status(201).json({
      success: true,
      message: 'Pedido processado e salvo com sucesso!',
      orderId: newOrder.orderId,
      method: newOrder.method,
      itemsCount: newOrder.items.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar o pedido', details: error.message });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o pedido' });
  }
});

module.exports = router;