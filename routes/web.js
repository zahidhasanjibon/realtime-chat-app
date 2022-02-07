const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");

// middlewares for routes protection
const guest = require("../app/http/middlewares/guest");
const auth = require("../app/http/middlewares/auth");
const admin = require("../app/http/middlewares/admin");

function initRoutes(app) {
  app.get("/", homeController().index);

  app.get("/register", guest, authController().register);
  app.post("/register", authController().postRegister);

  app.get("/login", guest, authController().login);
  app.post("/login", authController().postLogin);
  app.post("/logout", authController().logout);

  app.get("/cart", auth, cartController().index);
  app.post("/update_cart", cartController().update);

  // customers routes
  app.post("/orders", auth, orderController().store);
  app.get("/customerorders", auth, orderController().index);

  // admin routes
  app.get("/adminorders", admin, AdminOrderController().index);
}
module.exports = initRoutes;
