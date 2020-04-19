const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = mongoose.Schema({
    description : {type : String, required : true},
	userId : {type: Schema.Types.ObjectId, ref : 'User', required: true},
	responders : [{
        userId : {type : Schema.Types.ObjectId, ref : 'User'},
        betPrice : {type : Number},
        comment : {type : String}
    }],
	partnerId : {type: Schema.Types.ObjectId, ref : 'User'},
	serviceId : {type: Schema.Types.ObjectId, ref : 'Service', required: true},
	price : {type : Number},
	location : {type : String}, //????????
	preferedHour : {type : Date},
	status : {type : String, default : 'New'}
}, {timestamps : true});

module.exports = mongoose.model('Order', orderSchema);
