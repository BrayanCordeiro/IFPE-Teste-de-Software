const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 
const Offer = require('../models/Offer');

router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, message: 'Produto criado com sucesso', product });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar produto', details: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o produto', details: error.message });
  }
});

router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    await product.update(req.body);
    
    res.json({ success: true, message: 'Produto atualizado com sucesso', product });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar produto', details: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const deletedCount = await Product.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    
    res.json({ success: true, message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto', details: error.message });
  }
});

router.post('/offers', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);
    res.status(201).json({ success: true, message: 'Oferta criada com sucesso', offer });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao criar oferta', details: error.message });
  }
});

router.get('/offers', async (req, res) => {
  try {
    const offers = await Offer.findAll();
    res.json(offers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ofertas', details: error.message });
  }
});

router.get('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }
    
    res.json(offer);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar oferta', details: error.message });
  }
});

router.put('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findByPk(req.params.id);
    
    if (!offer) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }
    
    await offer.update(req.body);
    
    res.json({ success: true, message: 'Oferta atualizada', offer });
  } catch (error) {
    res.status(400).json({ error: 'Erro ao atualizar oferta', details: error.message });
  }
});

router.delete('/offers/:id', async (req, res) => {
  try {
    const deletedCount = await Offer.destroy({
      where: { id: req.params.id }
    });
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Oferta não encontrada' });
    }
    
    res.json({ success: true, message: 'Oferta removida com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover oferta', details: error.message });
  }
});

module.exports = router;