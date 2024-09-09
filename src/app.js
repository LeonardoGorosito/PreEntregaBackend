import express from 'express';
import productsRouter from './routes/products.js';
import cartsRouter from './routes/carts.js';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import  handlebars from 'express-handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.engine('handlebars',handlebars.engine());
app.set('views',`${__dirname}/views`);
app.set('view engine','handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const io = new SocketIOServer(server);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    
    socket.on('updateProductList', (data) => {
        io.emit('updateProductList', data);
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});
