const express = require("express");

// const getChatRoom = require("../controllers/inboxContoller");
// const messageController = require("../controllers/message");
const { getInbox,searchUser,addConversation } = require("../controllers/inboxContoller");
const isAuth = require("../middlewares/is-auth");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const router = express.Router();
router.get("/", decorateHtmlResponse("Inbox"), getInbox);

router.post("/search", searchUser);

router.post("/conversation", addConversation);


// router.get("/", isAuth, getChatRoom.getChatRoom);

// router.get("/", isAuth, messageController.getMessage);
// router.post("/", isAuth, messageController.postMessage);

module.exports = router;
