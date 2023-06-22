const Message = require("../models/Message");
exports.getMessage = (req, res) => {
  Message.find()
    .then((message) => {
      res.render("chatroom/index", {
        message: message,
        pageTitle: "message user",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })

    .catch((error) => {
      console.log(error);
      console.log(contents);
    });
};
exports.postMessage = (req, res) => {
  const message = req.body.message;

  const messages = new Message({
    message: message,

    isAuthenticated: req.session.isLoggedIn,
  });
  messages.save().then((result) => {
    console.log("created Message");
    res.redirect("/");
  });
};
