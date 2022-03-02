const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");
const productController = require("./api");

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
  app.get("/customer/orders", auth, orderController().index);
  app.get("/customer/orders/:id", auth, orderController().show);

  // admin routes
  app.get("/admin/orders", admin, AdminOrderController().index);
  app.post("/admin/orders/status", admin, statusController().update);

  // order increment decrement delete api routes
  app.post("/delete_cart_product", productController().delete);
  app.post("/increment_cart_product", productController().increment);
  app.post("/decrement_cart_product", productController().decrement);
}
module.exports = initRoutes;
