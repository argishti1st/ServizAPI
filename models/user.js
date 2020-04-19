const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email : {
        type: String, 
        required: true, 
        unique : true, 
        match : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {type: String, required: true},
    isActive : {type: Boolean, default : true},
    userRole: {type: String, default : 'User'},
    orders : [{type : Schema.Types.ObjectId, ref : 'Order'}]
}, 
{strict : false});

module.exports = mongoose.model('User', userSchema);