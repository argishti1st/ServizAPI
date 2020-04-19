const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const orderRoutes = require('../controllers/order');

const router = express.Router();


router.get('/getOrders', checkAuth, orderRoutes.getOrders);

router.post('/createOrder', checkAuth, orderRoutes.createOrder);

router.get('/getOrder/:orderId', checkAuth, orderRoutes.getOrder);

router.put('/updateOrder/:orderId', checkAuth, orderRoutes.updateOrder);

router.delete('/cancelOrder/:orderId', checkAuth, orderRoutes.cancelOrder);

router.put('/respond/:orderId', checkAuth, orderRoutes.respondToOrder);

router.put('/approve/:orderId', checkAuth, orderRoutes.approveOrder);

module.exports = router;