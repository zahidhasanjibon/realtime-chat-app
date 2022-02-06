const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const carthController = require("../app/http/controllers/customers/cartController");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/register", authController().register);
  app.post("/register", authController().postRegister);

  app.get("/login", authController().login);
  app.post("/login", authController().postLogin);

  app.get("/cart", carthController().index);
  app.post("/update_cart", carthController().update);
}
module.exports = initRoutes;
