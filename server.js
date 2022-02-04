//external module
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

// main
const app = express();
const PORT = process.env.PORT || 3000;

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// route setup
app.get("/", (req, res, next) => {
  res.render("home");
});
app.get("/cart", (req, res) => {
  res.render("customers/cart");
});
app.get("/register", (req, res) => {
  res.render("auth/register");
});
app.get("/login", (req, res) => {
  res.render("auth/login");
});

app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`);
});
