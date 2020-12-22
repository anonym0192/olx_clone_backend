const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modelSchema = mongoose.Schema({
    name: String,
    title: String,
    description: String,
    price: Number,
    priceNegotiable: Boolean,
    images: [Object],
    dateCreated: Date,
    active: String,
    views: Number,
    category: String,
    user: String,
    state: String
});

const modelName = "Ad";

if(mongoose.connection && mongoose.connection.models[modelName]){
    module.exports = mongoose.connection.models[modelName];
}else{
    module.exports = mongoose.model(modelName, modelSchema); 
}