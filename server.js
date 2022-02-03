//external module
const express = require("express");
const ejs = require("ejs");
const expressLayout = require("express-ejs-layouts");
const path = require("path");

// main
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res, next) => {
  res.render("home");
});

// set template engine
app.use(expressLayout);
app.set("views", path.join(__dirname, "/resources/views"));
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`port listening on ${PORT}`);
});
