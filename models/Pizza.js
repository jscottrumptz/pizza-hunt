// Although MongoDB doesn't enforce any data normalization, the database collections will 
// benefit from at least a little bit of structure. Mongoose fills that need, allowing us 
// to add rules for the data so that it's not a free-for-all. Mongoose also provides us with 
// a lot of similar capabilities that Sequelize offers, like data validation, prebuilt methods 
// to perform actions on a MongoDB database collection, and much more.

// We could import the entire mongoose library, but we only need to worry about the 
// Schema constructor and model function, so we'll just import them.
const { Schema, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const PizzaSchema = new Schema(
    {
        pizzaName: {
            type: String,
            required: 'You need to provide a pizza name!',
            trim: true
        },
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now,
            // To use a getter in Mongoose, we just need to add the key get to the field we are 
            // looking to use it with in the schema. Just like a virtual, the getter will transform 
            // the data before it gets to the controller(s).
            get: (createdAtVal) => dateFormat(createdAtVal)
        },
        size: {
            type: String,
            // If you were to provide a custom error message for the required option here, you wouldn't 
            // receive it if you provide a size that isn't listed in the enum option. If you want to 
            // provide a custom message for enumerable values, you need to look into implementing the 
            // validate option Mongoose lets you use, where you can create a custom function to test the 
            // values, just like you did with Inquirer!
            required: true,
            enum: ['Personal', 'Small', 'Medium', 'Large', 'Extra Large'],
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
    // we'll need to tell the Mongoose model that it should use any getter function we've specified.
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    // We set id to false because this is a virtual that Mongoose returns, and we don’t need it.
    id: false
    }
);

// get total count of comments and replies on retrieval
PizzaSchema.virtual('commentCount').get(function() {
    // Here we're using the .reduce() method to tally up the total of every comment with its replies. 
    return this.comments.reduce((total, comment) => total + comment.replies.length + 1, 0);
  });

// create the Pizza model using the PizzaSchema
const Pizza = model('Pizza', PizzaSchema);

// export the Pizza model
module.exports = Pizza;