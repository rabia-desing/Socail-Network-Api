const { User, Thought } = require("../models");

const thoughtController = {


  getThought(req, res) {
    Thought.find({})
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },



  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((singleThought) =>
        !singleThought
          ? res.status(404).json({ message: "We did not find any thought with that id, please try later" })
          : res.json(singleThought)
      )
      .catch((err) => res.status(500).json(err));
  },


  createThought(req, res) {
    Thought.create(req.body)
      .then(({ _id }) => {
        return User.findOneAndUpdate(
          { _id: req.body.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((thoughtCreate) =>
        !thoughtCreate
          ? res.status(404).json({ message: "We did not find any user with that id, please try later" })
          : res.json(thoughtCreate)
      )
      .catch((err) => res.status(500).json(err));
  },


  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, New: true }
    )
      .then((thoughtUpdate) =>
        !thoughtUpdate
          ? res.status(404).json({ message: "We did not find any thought with that id, please try later" })
          : res.json(thoughtUpdate)
      )
      .catch((err) => res.status(500).json(err));
  },


  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thoughtDelete) =>
        !thoughtDelete
          ? res.status(404).json({ message: "We did not find any thought with that id, please try later" })
          : User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          )
      )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "We did not find any thought with that id, please try later" })
          : res.json({ message: 'Thought Deleted' })
      )
      .catch((err) => res.status(500).json(err));
  },


  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thoughtReactionCreate) =>
        !thoughtReactionCreate
          ? res.status(404).json({ message: "We did not find any thought with that id, please try later" })
          : res.json(thoughtReactionCreate)
      )
      .catch((err) => res.status(500).json(err));
  },


  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    )
      .then((reactionDelete) =>
        !reactionDelete
          ? res.status(404).json({ message: "We did not find any thought with that id, please try later" })
          : res.json(reactionDelete)
      )
      .catch((err) => res.status(500).json(err));
  },

};

module.exports = thoughtController;