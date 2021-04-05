// Although MongoDB doesn't enforce any data normalization, the database collections will 
// benefit from at least a little bit of structure. Mongoose fills that need, allowing us 
// to add rules for the data so that it's not a free-for-all. Mongoose also provides us with 
// a lot of similar capabilities that Sequelize offers, like data validation, prebuilt methods 
// to perform actions on a MongoDB database collection, and much more.

// We could import the entire mongoose library, but we only need to worry about the 
// Schema constructor and model function, so we'll just import them.
const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema({
    pizzaName: {
        type: String
    },
    createdBy: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    size: {
        type: String,
        default: 'Large'
    },
    toppings: []
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;