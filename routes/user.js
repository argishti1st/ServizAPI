const express = require('express');
const {body} = require('express-validator/check');

const router = express.Router();

const checkAuth = require('../middlewares/check-auth');
const User = require('../models/user');

const UserController = require('../controllers/user');

router.post('/signup', [body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail()
.custom((value, {req})=>{
    console.log(value);
    return User.findOne({email : value}).then(user => {
        console.log(user);
        if(user){
            console.log('here');
            return Promise.reject('Email address already exists');
        }
    });
}),
body('password').trim().isLength({min: 5})
], UserController.user_signup);

router.post('/login', UserController.user_login);

router.post('/disable/:userId', checkAuth, UserController.disable_user);

router.post('/update/:userId', checkAuth, UserController.update_user);

module.exports = router;