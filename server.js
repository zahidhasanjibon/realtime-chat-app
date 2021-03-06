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
const Emitter = require("events");

// main
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

// mongodb connecction
mongoose
  .connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("database connection successful!"))
  .catch((err) => console.log(err));

// Events emitter
const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);

// session config
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbSessionStore.create({
      mongoUrl: process.env.SESSION_MONGO_URL,
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
app.use((req, res) => {
  res.status(404).render("errors/404");
});

const server = app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`);
});

const io = require("socket.io")(server);
io.on("connection", (socket) => {
  console.log(`new socket.io connection`);
  socket.on("join", (roomName) => {
    socket.join(roomName);
  });
});

eventEmitter.on("orderUpdated", (data) => {
  io.to(`order_${data.id}`).emit("orderUpdated", data);
});
eventEmitter.on("orderPlaced", (data) => {
  io.to("adminRoom").emit("orderPlaced", data);
});
