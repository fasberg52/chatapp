module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login");
    console.log("You are not logged in")
  } 
  next()
};
