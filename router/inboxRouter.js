const express = require("express");

// const getChatRoom = require("../controllers/inboxContoller");
// const messageController = require("../controllers/message");
const { getInbox,searchUser,addConversation,getMessages,sendMessage} = require("../controllers/inboxContoller");
const isAuth = require("../middlewares/is-auth");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const router = express.Router();
router.get("/", decorateHtmlResponse("Inbox"), getInbox);

router.post("/search", searchUser);

router.post("/conversation",addConversation);

router.get("/messages/:conversation_id", getMessages);

router.post("/message", sendMessage);
// router.get("/", isAuth, getChatRoom.getChatRoom);

// router.get("/", isAuth, messageController.getMessage);
// router.post("/", isAuth, messageController.postMessage);

module.exports = router;
