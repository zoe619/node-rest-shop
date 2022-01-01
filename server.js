const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const userRoutes = require('./api/routes/users')

dotenv.config();


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'))

app.use('/products', productsRoutes)
app.use('/orders', ordersRoutes)
app.use('/users', userRoutes)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === "OPTIONS") {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, UPDATE, PUT')
        res.status(200).json({})
    }
    next();
})


app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})


mongoose.connect(process.env.MONGO_URI)
    .then((result) => {
        console.log('connected:' + result);
        app.listen(port, () => {
            console.log(`server started at port: ${port}`);
        })
    })
    .catch(error => console.log(error));