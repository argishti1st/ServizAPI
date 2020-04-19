const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type : String, required : true},
    minPrice: {type : Number, required : true},
    estimatedMinDuration : {type : Number},
    timeDurationUnit : {type : String, enum : ['m', 'h']},
    image : {type : String},
    description : {type : String, required : true},
    isActive : {type: Boolean}
});

module.exports = mongoose.model('Service', serviceSchema);