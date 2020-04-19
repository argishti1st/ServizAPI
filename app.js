const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const servicesRouter = require('./routes/service');
const ordersRouter = require('./routes/order');
const userRoutes = require('./routes/user');
//mongodb+srv://argishti1st:<password>@cluster0-4mib5.mongodb.net/test?retryWrites=true&w=majority
console.log('sssssssssss')

// mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

app.use('/services', servicesRouter);
app.use('/orders', ordersRouter);
app.use('/user', userRoutes);

// app.use((req, res, next)=>{
//     const error = new Error('Not found');
//     error.status = 404;
//     next(error);
// })

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message : message,
        data: data
    });
});

mongoose.connect('mongodb+srv://argishti_1st:PGO5QzncQNjqrCIy@udemynodejs-qpf3o.mongodb.net/serviX')
.then(result => {
    console.log('connected');
    app.listen(3000);
})
.catch(err => {
    console.log(err);
})