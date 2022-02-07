//external module
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const dotenv = require("dotenv");
const flash = require("express-flash");
const MongoDbSessionStore = require("connect-mongo");
const passport = require("passport");

// main
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

// mongodb connecction
mongoose
  .connect("mongodb://localhost/pizza", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

// session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbSessionStore.create({
      mongoUrl: "mongodb://127.0.0.1/pizza",
    }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);
// passport config
const passportInit = require("./app/config/passport");
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(expressLayout);
app.use(express.static("public"));

// set template engine

app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

// require all web routes
require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`);
});
