import { Router } from 'express';

const router = Router();

let products = [
    { id: 1, title: 'Producto 1', description: 'Descripción del producto 1', code: 'P1', price: 100, status: true, stock: 10, category: 'Categoría 1', thumbnails: [] },
    { id: 2, title: 'Producto 2', description: 'Descripción del producto 2', code: 'P2', price: 200, status: true, stock: 20, category: 'Categoría 2', thumbnails: [] }
];

const generateId = () => {
    return products.length > 0 ? products[products.length - 1].id + 1 : 1;
};

router.post('/', (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    const newProduct = {
        id: generateId(),
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
    };

    products.push(newProduct);

    res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
});

router.get('/', (req, res) => {
    const limit = req.query.limit;
    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

router.get('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.put('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };
    
    updatedProduct.id = productId;
    
    products[productIndex] = updatedProduct;

    res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
});

router.delete('/:pid', (req, res) => {
    const productId = parseInt(req.params.pid);
    
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);

    res.json({ message: 'Producto eliminado con éxito' });
});


export default router;
