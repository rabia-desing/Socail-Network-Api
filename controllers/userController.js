const { User, Thought } = require("../models");

const userController = {



  getUser(req, res) {
    User.find({})
      .then((allUsers) => res.json(allUsers))
      .catch((err) => res.status(500).json(err));
  },



  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((singleUser) =>
        !singleUser
          ? res.status(404).json({ message: "We did not find any user with that id, please try later" })
          : res.json(singleUser)
      )
      .catch((err) => res.status(500).json(err));
  },



  createUser(req, res) {
    User.create(req.body)
      .then((createUser) => res.json(createUser))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },



  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((updateUser) =>
        !updateUser
          ? res.status(404).json({ message: "We did not find any user with that id, please try later" })
          : res.json(updateUser)
      )
      .catch((err) => res.status(500).json(err));
  },



  //Bonus work starts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((removeUserAssocThought) =>
        !removeUserAssocThought
          ? res.status(404).json({ message: "We did not find any user with that id, please try later" })
          : Thought.deleteMany({ _id: { $in: removeUserAssocThought.thoughts } })
      )
      .then(() => res.json({ message: "User Deleted" }))
      .catch((err) => res.status(500).json(err));
  },



  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((addFriend) =>
        !addFriend
          ? res.status(404).json({ message: "We did not find any user with that id, please try later" })
          : res.json(addFriend)
      )
      .catch((err) => res.status(500).json(err));
  },



  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then(
        (deleteFriend) =>
          !deleteFriend
            ? res.status(404).json({ message: "We did not find any user with that id, please try later" })
            : res.json(deleteFriend)
      )
      .catch((err) => res.status(500).json(err));
  },

  //Bonus work ends
};


module.exports = userController;
