import express from 'express';
const router = express.Router();

// Simulación de base de datos de productos
let products = [];

router.get('/', (req, res) => {
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

router.post('/addProduct', (req, res) => {
  const { name } = req.body;
  const newProduct = { id: Date.now(), name };
  products.push(newProduct);
  io.emit('updateProductList', products); // Emitir la lista actualizada por WebSocket
  res.redirect('/realtimeproducts');
});

router.post('/deleteProduct', (req, res) => {
  const { id } = req.body;
  products = products.filter(product => product.id !== parseInt(id));
  io.emit('updateProductList', products); // Emitir la lista actualizada por WebSocket
  res.redirect('/realtimeproducts');
});

export default router;
