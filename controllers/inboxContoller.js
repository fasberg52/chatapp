const User = require("../models/People");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

async function getInbox(req, res, next) {
  try {
    const userid = req.session.user._id;
    const user = req.session.user;
    const conversations = await Conversation.find({
      $or: [{ "creator.id": userid }, { "participant.id": userid }],
    });
    res.locals.data = conversations;
    res.render("inbox", {
      userid,
      user,
    });
  } catch (err) {
    next(err);
  }
}

async function searchUser(req, res, next) {
  const user = req.body.user;

  console.log(`>>>>>>>>> ${typeof user}`);
  console.log("Request body:", req.body);

  try {
    const users = await User.find({
      email: user,
    });

    res.json(users);
    console.log(`>>>>>>>>> ${users}`);
  } catch (error) {
    console.error("Search for users Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for receivers." });
  }
}

async function addConversation(req, res, next) {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.session.user._id,
        name: req.session.user.name,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
      },
    });

    const result = await newConversation.save();
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

module.exports = {
  getInbox,
  searchUser,
  addConversation,
};
