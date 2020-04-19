const express = require('express');
const router = express.Router();

const checkAuth = require('../middlewares/check-auth');

const ServiceController = require('../controllers/services');

router.post('/addservice', ServiceController.service_creation);
router.get('/', ServiceController.get_all_services);
router.get('/:serviceID', ServiceController.get_a_service);
router.post('/update/:serviceID', checkAuth, ServiceController.update_a_service);
router.post('/disable/:serviceID', checkAuth, ServiceController.disable_service);

module.exports = router;
