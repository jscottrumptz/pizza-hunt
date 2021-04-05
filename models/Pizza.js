// Although MongoDB doesn't enforce any data normalization, the database collections will 
// benefit from at least a little bit of structure. Mongoose fills that need, allowing us 
// to add rules for the data so that it's not a free-for-all. Mongoose also provides us with 
// a lot of similar capabilities that Sequelize offers, like data validation, prebuilt methods 
// to perform actions on a MongoDB database collection, and much more.

// We could import the entire mongoose library, but we only need to worry about the 
// Schema constructor and model function, so we'll just import them.
const { Schema, model } = require('mongoose');

const PizzaSchema = new Schema(
    {
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
        toppings: [],
        // we need to tell Mongoose to expect an ObjectId and 
        // to tell it that its data comes from the Comment model.
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    // we need to tell the schema that it can use virtuals.
    {
    toJSON: {
        virtuals: true,
    },
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id: false
    }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    return this.comments.length;
});

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;