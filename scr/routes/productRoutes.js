const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Offer = require('../models/Offer');

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Produto criado', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'ID inválido ou erro no servidor' });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ success: true, message: 'Produto atualizado', product });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json({ success: true, message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
});

router.post('/offers', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, message: 'Oferta criada com sucesso', offer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/offers', async (req, res) => {
  try {
    const offers = await Offer.find();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ofertas' });
  }
});

router.get('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta não encontrada' });
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'ID inválido ou erro no servidor' });
  }
});

router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!offer) return res.status(404).json({ error: 'Oferta não encontrada' });
    res.json({ success: true, message: 'Oferta atualizada', offer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.status(404).json({ error: 'Oferta não encontrada' });
    res.json({ success: true, message: 'Oferta removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover oferta' });
  }
});

module.exports = router;