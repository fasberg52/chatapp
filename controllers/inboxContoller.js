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
    const userid = req.session.user._id;
    const name = req.session.user.name;
    const newConversation = new Conversation({
      creator: {
        id: userid,
        name: name,
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
async function getMessages(req, res, next) {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    })

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.session.user._id,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error",
        },
      },
    });
  }
}

async function sendMessage(req, res, next) {
  console.log(req.body);
  if (req.body.message) {
    try {
      // save message text in database
      const userid = req.session.user._id;
      const newMessage = new Message({
        text: req.body.message,

        sender: {
          id: userid,
          name: req.session.user.name,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

       //emit socket event
        // global.io.emit("new_message", {
        //   message: {
        //     conversation_id: req.body.conversationId,
        //     sender: {
        //       id: req.session.user._id,
        //       name: req.session.user.name,
        //     },
        //     message: req.body.message,

        //     date_time: result.date_time,
        //   },
        // });

      res.status(200).json({
        message: "Successful!",
        data: result,
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
  } else {
    res.status(500).json({
      errors: {
        common: "message text or attachment is required!",
      },
    });
  }
}
module.exports = {
  getInbox,
  searchUser,
  addConversation,
  getMessages,
  sendMessage,
};
