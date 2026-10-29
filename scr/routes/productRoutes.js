const express = require('express');
const router = express.Router();
const { products, offers } = require('../data/database');

router.post('/products', (req, res) => {
  const { name, price, category, glow } = req.body;
  
  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Nome, preço e categoria são obrigatórios' });
  }

  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
  
  const newProduct = { 
    id: newId, 
    name, 
    price, 
    category, 
    glow: glow || 'var(--primary)'
  };
  
  products.push(newProduct);
  res.status(201).json({ success: true, message: 'Produto criado com sucesso', product: newProduct });
});

router.get('/products', (req, res) => {
  res.json(products);
});

router.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  res.json(product);
});

router.put('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, category, glow } = req.body;
  
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  const updatedProduct = {
    ...products[productIndex],
    name: name !== undefined ? name : products[productIndex].name,
    price: price !== undefined ? price : products[productIndex].price,
    category: category !== undefined ? category : products[productIndex].category,
    glow: glow !== undefined ? glow : products[productIndex].glow
  };
  
  products[productIndex] = updatedProduct;
  
  res.json({ success: true, message: 'Produto atualizado com sucesso', product: updatedProduct });
});

router.delete('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Produto não encontrado' });
  }
  
  products.splice(productIndex, 1);
  res.json({ success: true, message: 'Produto removido com sucesso' });
});

router.get('/offers', (req, res) => {
  res.json(offers);
});

module.exports = router;

router.post('/offers', (req, res) => {
  const { name, price, originalPrice, discount, category, glow } = req.body;
  
  if (!name || !price || !originalPrice || !category) {
    return res.status(400).json({ error: 'Nome, preço, preço original e categoria são obrigatórios' });
  }

  const newId = offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1;
  
  const newOffer = { 
    id: newId, 
    name, 
    price, 
    originalPrice,
    discount: discount || '-0%', 
    category, 
    glow: glow || 'var(--primary)'
  };
  
  offers.push(newOffer);
  res.status(201).json({ success: true, message: 'Oferta criada com sucesso', offer: newOffer });
});

router.get('/offers', (req, res) => {
  res.json(offers);
});

router.get('/offers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const offer = offers.find(o => o.id === id);
  
  if (!offer) {
    return res.status(404).json({ error: 'Oferta não encontrada' });
  }
  
  res.json(offer);
});

router.put('/offers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, price, originalPrice, discount, category, glow } = req.body;
  
  const offerIndex = offers.findIndex(o => o.id === id);
  
  if (offerIndex === -1) {
    return res.status(404).json({ error: 'Oferta não encontrada' });
  }
  
  const updatedOffer = {
    ...offers[offerIndex],
    name: name !== undefined ? name : offers[offerIndex].name,
    price: price !== undefined ? price : offers[offerIndex].price,
    originalPrice: originalPrice !== undefined ? originalPrice : offers[offerIndex].originalPrice,
    discount: discount !== undefined ? discount : offers[offerIndex].discount,
    category: category !== undefined ? category : offers[offerIndex].category,
    glow: glow !== undefined ? glow : offers[offerIndex].glow
  };
  
  offers[offerIndex] = updatedOffer;
  
  res.json({ success: true, message: 'Oferta atualizada com sucesso', offer: updatedOffer });
});

router.delete('/offers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const offerIndex = offers.findIndex(o => o.id === id);
  
  if (offerIndex === -1) {
    return res.status(404).json({ error: 'Oferta não encontrada' });
  }
  
  offers.splice(offerIndex, 1);
  res.json({ success: true, message: 'Oferta removida com sucesso' });
});