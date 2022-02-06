const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const carthController = require("../app/http/controllers/customers/cartController");
const guest = require("../app/http/middlewares/guest");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  app.get("/cart", carthController().index);
  app.post("/update_cart", carthController().update);
}
module.exports = initRoutes;
