const Service = require('../models/service');
const mongoose = require('mongoose');
const _ = require('lodash');

module.exports.get_all_services = (req, res, next)=>{
    Service.find({isActive : true})
    .select('_id name description minPrice')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            services: docs.map(doc=>{
                console.log(doc);
                return {
                    name: doc.name,
                    minPrice: doc.minPrice,
                    //productImage : doc.productImage,
                    description : doc.description,
                    _id: doc._id,
                    request : {
                        type : 'GET',
                        URL : 'http://localhost:3000/services/' + doc._id
                    }
                }
            })
        }
        // if(docs.length >= 0){
            res.status(200).json(response);
        // }
        // else{
        //     res.status(404).json({message: 'No entries'});
        // }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err}); 
    });
}

module.exports.service_creation = (req, res, next)=>{
    console.log(req.body);
    const service = new Service({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        minPrice: req.body.minPrice,
        estimatedMinDuration : req.body.estimatedMinDuration,
        timeDurationUnit : req.body.timeDurationUnit,
        description : req.body.description,
        isActive : true
        //productImage : req.file.path
    });

    service
        .save(console.log(111))
        .then(result=>{
            console.log(result);
            res.status(201).json({
                message : "Service added successfully",
                createdProdService: {
                    name : result.name,
                    minPrice : result.minPrice,
                    request : {
                        type : 'GET',
                        URL : 'http://localhost:3000/services/' + result._id
                    }   
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err}); 
        });
}

module.exports.get_a_service = (req, res, next)=>{
    const id = req.params.productId;
    Service.findById(id)
        .select('name description minPrice') //image should be added
        .exec()        
        .then(doc =>{
            if(doc){
                res.status(200).json({
                    service : doc,
                    request : {
                        type : 'GET',
                        description : 'To get all services',
                        url : 'http://localhost:3000/services'
                    }
                });
            }
            else{
                res.status(404).json({message: 'Not found'});
            }            
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});     
        });
}

module.exports.update_a_service = (req, res, next)=>{
    const body = _.pickBy(req.body, _.isDefined);
    Service.updateOne({_id : req.params.serviceId}, { $set: body }).exec()
    .then(result =>{
        console.log(result)
        res.status(200).json({
            message : 'Service has been updated'
        })            
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
}

module.exports.disable_service = (req, res, next)=>{
    const id = req.params.productId
    Product.updateOne({_id: id}, {isActive : false})
    .exec()
    .then(result=>{
        res.status(200).json({
            message : 'Service deleted',
            request : {
                type :'POST',
                url : 'http://localhost:3000/services',
                body : {name : 'String', price : 'Number'}
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error: err});
    });
}