const { Comment, Pizza } = require('../models');

const commentController = {
    // add comment to pizza
    addComment({ params, body }, res) {
        console.log(body);
        Comment.create(body)
        .then(({ _id }) => {
            return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            { $push: { comments: _id } },
            // Again, because we passed the option of new: true, we're receiving back 
            // the updated pizza (the pizza with the new comment included).
            { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    },
  
    addReply({ params, body }, res) {
        Comment.findOneAndUpdate(
          { _id: params.commentId },
          // use $addToSet to block duplicates instead of $push
          { $push: { replies: body } },
          { new: true, runValidators: true }
        )
          .then(dbPizzaData => {
            if (!dbPizzaData) {
              res.status(404).json({ message: 'No pizza found with this id!' });
              return;
            }
            res.json(dbPizzaData);
          })
          .catch(err => res.json(err));
    },

    // remove reply
    removeReply({ params }, res) {
        Comment.findOneAndUpdate(
        { _id: params.commentId },
        // Here, we're using the MongoDB $pull operator to remove the specific reply from the replies 
        // array where the replyId matches the value of params.replyId passed in from the route.
        { $pull: { replies: { replyId: params.replyId } } },
        { new: true }
        )
        .then(dbPizzaData => res.json(dbPizzaData))
        .catch(err => res.json(err));
    },

    removeComment({ params }, res) {
        Comment.findOneAndDelete({ _id: params.commentId })
        .then(deletedComment => {
            if (!deletedComment) {
                return res.status(404).json({ message: 'No comment with this id!' });
            }
            return Pizza.findOneAndUpdate(
            { _id: params.pizzaId },
            { $pull: { comments: params.commentId } },
            // Lastly, we return the updated pizza data, now without the _id of the comment 
            // in the comments array, and return it to the user.
            { new: true }
            );
        })
        .then(dbPizzaData => {
            if (!dbPizzaData) {
                res.status(404).json({ message: 'No pizza found with this id!' });
                return;
            }
            res.json(dbPizzaData);
        })
        .catch(err => res.json(err));
    }
  };
  
  module.exports = commentController;