const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');

const User = require('../models/user');
const _ = require('lodash');

module.exports.user_signup = async (req, res, next) =>{
    
    const email = req.body.email;
    const password = req.body.password;

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }
        const hashedPw = await bcrypt.hash(password, 12);
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            password: hashedPw,
            isActive: true,
            userRole: 'customer'
        });
        const result = await user.save();
        return res.status(201).json({
            message: 'User created successfully',
            user : result
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
    }
    // User.find({email: req.body.email}).exec()
    // .then(user => {
    //     console.log("after find***************")
    //     if(user.length>=1){
    //         return res.status(409).json({
    //             message : 'Mail exists already'
    //         });
    //     }
    //     else{
    //         bcrypt.hash(req.body.password, 10, (err, hash)=>{
    //             if(err){
    //                 return res.status(500).json({
    //                     error: err
    //                 });
    //             }else{
    //                 const user = new User({
    //                     _id: new mongoose.Types.ObjectId(),
    //                     email: req.body.email,
    //                     password: hash,
    //                     isActive: true,
    //                     userRole: 'customer'
    //                 });
    //                 console.log("before save***************");
    //                 user.save()
    //                 .then(result =>{
    //                     console.log("after save***************")
    //                     console.log(result);
    //                     return res.status(201).json({
    //                         message: 'User created successfully',
    //                         user : user
    //                     });
    //                 })
    //                 .catch(err => {
    //                     console.log(err);
    //                     res.status(500).json({error: err}); 
    //                 });
    //             }    
    //         })
    //     }
    // })
    // .catch();    
}

module.exports.user_login = (req, res, next)=>{
    User.find({email : req.body.email})
    .exec()
    .then(user => {
        console.log(user);
        console.log(user.length, user[0].isActive);
        if(user.length < 1 || user[0].isActive === false){
            return res.status(401).json({
                message : 'Auth Failed'
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result)=>{
            if(err){
                return res.status(401).json({
                    message : 'Auth Failed'
                });
            }
            if(result){
                const token = jwt.sign({
                    email: user[0].email,
                    userId : user[0]._id
                }, process.env.JWT_KEY, 
                {
                    expiresIn : "1h"
                });
                
                return res.status(200).json({
                    message : 'Auth successful',
                    token : token
                });  
            }

            return res.status(401).json({
                message : 'Auth Failed'
            });
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); 
    });
}

module.exports.disable_user = (req, res, next)=>{
    //User.remove({_id : req.params.userId}).exec()
    User.updateOne({_id : req.params.userId},{isActive : false}).exec()
    .then(result =>{
        res.status(200).json({
            message : 'User deactivated successfully'
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); 
    });
}

module.exports.update_user = (req, res, next)=>{
    const body = _.pickBy(req.body, _.isDefined);

    User.updateOne({_id : req.params.userId}, { $set: body }).exec()
    .then(result =>{
        console.log(result)
        res.status(200).json({
            message : 'User information has been updated'
        })            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}