import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';



const app = express();

const PORT = process.env.PORT||8080;

const server = app.listen(PORT,()=>console.log(`Listening on ${PORT}`));

app.use(express.json());


app.use('/api/products', productsRouter)

app.use('/api/carts', cartsRouter);





