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
    }).sort("-createdAt");

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userid,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
}

async function sendMessage(req, res, next) {
  if (req.body.message || (req.files && req.files.length > 0)) {
    try {
      // save message text/attachment in database
      let attachments = null;

      if (req.files && req.files.length > 0) {
        attachments = [];

        req.files.forEach((file) => {
          attachments.push(file.filename);
        });
      }

      const newMessage = new Message({
        text: req.body.message,
        attachment: attachments,
        sender: {
          id: req.user.userid,
          name: req.user.username,
          avatar: req.user.avatar || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userid,
            name: req.user.username,
            avatar: req.user.avatar || null,
          },
          message: req.body.message,
          attachment: attachments,
          date_time: result.date_time,
        },
      });

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
