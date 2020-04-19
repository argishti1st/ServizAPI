const Order = require('../models/order');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('userId').populate('serviceId');
        res.status(200).json({
            message: 'Fetched successfully',
            orders : orders
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
};

exports.createOrder = async (req, res, next) => {
    const description = req.body.description;
    const userId = req.userData.userId;
    const serviceId = req.body.serviceId;
    const price = req.body.price;
    const location = req.body.location;
    const preferedHour = req.body.preferedHour;
    console.log('here22222222222222');

    const order = new Order({
        description : description,
        userId : userId,
        serviceId : serviceId,
        price : price,
        location : location,
        preferedHour : preferedHour
    });
     try {
        console.log('here1111111111111111');
        await order.save();
        console.log('here');
        const user = await User.findById(userId);
        if(!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 404;
        throw error;
        }
        user.orders.push(order);
        await user.save();
        res.status(201).json({
            message : 'Order created',
            order : order,
            userId : userId
        })
     } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
     }
};

exports.getOrder = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId).populate('userId').populate('serviceId');
        if (!order) {
            const error = new Error('Could not find post.');
            error.statusCode = 404;
            throw error;
          }
        res.status(200).json({
            message: 'Fetched successfully',
            order : order
        })
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
};

exports.updateOrder = async (req, res, next) => {
    const updatedDescription = req.body.description;
    const userId = req.userData.userId;
    const updatedPrice = req.body.price;
    const updatedLocation = req.body.location;
    const updatedPreferedHour = req.body.preferedHour;
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
        if(!order) {
            const error = new Error('Could not find order.');
            error.statusCode = 404;
            throw error;
        }
        if (order.userId.toString() !== req.userData.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        order.description = updatedDescription;
        order.price = updatedPrice;
        order.location = updatedLocation;
        order.preferedHour = updatedPreferedHour;

        const result = await order.save();
        res.status(200).json({ message: 'Order updated!', order: result });
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
};

exports.cancelOrder = async (req, res, next) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
    if(!order) {
        const error = new Error('Could not find order.');
        error.statusCode = 404;
        throw error;
    }
    if (order.userId.toString() !== req.userData.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 403;
        throw error;
    }

    order.status = 'canceled';
    await order.save();
    res.status(200).json({ message: 'Order canceled.' });

    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    } 
};

exports.respondToOrder = async (req, res, next) => {
    const orderId = req.params.orderId;
    const betPrice = req.body.betPrice;
    const comment = req.body.comment;
    const userId = req.userData.userId;
    try {
        const order = await Order.findById(orderId);
        if(!order) {
            const error = new Error('Could not find order.');
            error.statusCode = 404;
            throw error;
        }
        order.responders.push({userId : userId, betPrice : betPrice, comment : comment});
        await order.save();
        res.status(200).json({message : 'Your response added to orders responders list'});
    } catch{
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
};

exports.approveOrder = async (req, res, next) => {
    const orderId = req.params.orderId;
    const partnerId = req.body.partnerId;
    try {
        const order = await Order.findById(orderId);
        if(!order) {
            const error = new Error('Could not find order.');
            error.statusCode = 404;
            throw error;
        }
        if (order.userId.toString() !== req.userData.userId) {
            const error = new Error('Not authorized!');
            error.statusCode = 403;
            throw error;
        }
        order.status = 'In process';
        order.partnerId = partnerId;
        await order.save();
        res.status(200).json({message : 'Order is in process'})
    } catch (error) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }    
};