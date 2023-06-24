const express = require("express");
const User = require("./models/People");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csrf = require("csurf");
var moment = require('jalali-moment');


const Port = 3001;
const MONGODB_URI = "mongodb://127.0.0.1:27017/messangerFarawin1";
const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "session",
});

// const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");


app.locals.moment = moment;

const inboxRouter = require("./router/inboxRouter");
const authRouter = require("./router/auth");


app.use(express.json());

app.use(express.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(
  session({
    secret: "dont talk more and just show your code",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());
// app.use(csrfProtection);
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use("/inbox", inboxRouter);
app.use(authRouter);

mongoose
  .connect(MONGODB_URI)
  .then((connection) => {
    console.log(`connecting to mongodb ${MONGODB_URI}`);
  })
  .then((result) => {
    app.listen(Port, () => {
      console.log(`app running on ${Port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
