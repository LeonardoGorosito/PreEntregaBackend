import { Router } from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const productsFilePath = path.resolve('productos.json');
const cartsFilePath = path.resolve('carrito.json');

const readFile = async (filePath) => {
    try {
        const data = await fs.readJson(filePath);
        return data;
    } catch (err) {
        return [];
    }
};

const writeFile = async (filePath, data) => {
    await fs.writeJson(filePath, data, { spaces: 2 });
};

router.get('/:cid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const carts = await readFile(cartsFilePath);

    const cart = carts.find(c => c.id === cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    res.json(cart.products);
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const { quantity } = req.body;

    const carts = await readFile(cartsFilePath);
    const products = await readFile(productsFilePath);

    const cart = carts.find(c => c.id === cartId);
    const product = products.find(p => p.id === productId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const existingProduct = cart.products.find(p => p.product === productId);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.products.push({ product: productId, quantity });
    }

    await writeFile(cartsFilePath, carts);
    res.json({ message: 'Producto agregado al carrito', cart });
});

router.post('/', async (req, res) => {
    const carts = await readFile(cartsFilePath);

    const newCartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

    const newCart = {
        id: newCartId,
        products: []
    };

    carts.push(newCart);

    await writeFile(cartsFilePath, carts);

    res.status(201).json({ message: 'Carrito creado con éxito', cart: newCart });
});

export default router;
