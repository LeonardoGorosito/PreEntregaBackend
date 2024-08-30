import { Router } from 'express';
import fs from 'fs-extra';
import path from 'path';

const router = Router();
const productsFilePath = path.resolve('productos.json');

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

const generateId = async () => {
    const products = await readFile(productsFilePath);
    return products.length > 0 ? products[products.length - 1].id + 1 : 1;
};

router.post('/', async (req, res) => {
    const { title, description, code, price, status = true, stock, category, thumbnails = [] } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
    }

    const products = await readFile(productsFilePath);
    const newProduct = {
        id: await generateId(),
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
    await writeFile(productsFilePath, products);

    res.status(201).json({ message: 'Producto agregado con éxito', product: newProduct });
});

router.get('/', async (req, res) => {
    const limit = parseInt(req.query.limit);
    const products = await readFile(productsFilePath);

    if (limit) {
        res.json(products.slice(0, limit));
    } else {
        res.json(products);
    }
});

router.get('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const products = await readFile(productsFilePath);

    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

router.put('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    const products = await readFile(productsFilePath);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const updatedProduct = { ...products[productIndex], title, description, code, price, status, stock, category, thumbnails };
    updatedProduct.id = productId;
    
    products[productIndex] = updatedProduct;
    await writeFile(productsFilePath, products);

    res.json({ message: 'Producto actualizado con éxito', product: updatedProduct });
});

router.delete('/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    
    const products = await readFile(productsFilePath);
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }

    products.splice(productIndex, 1);
    await writeFile(productsFilePath, products);

    res.json({ message: 'Producto eliminado con éxito' });
});

export default router;
