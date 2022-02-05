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

// main
const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();
app.use(express.json());

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
// global middleware
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(flash());

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// require all web routes
require("./routes/web")(app);

app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`);
});
