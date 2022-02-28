const Order = require("../../../models/order");
const moment = require("moment");
function orderController(req, res) {
  return {
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: {
          createdAt: -1,
        },
      });
      res.header(
        "Cache-Control,no-cache,private,no-store,must-revalidate,max-stale=0,post-check=0,pre-check=0"
      );
      res.render("customers/orders", { orders: orders, moment: moment });
    },

    async store(req, res) {
      const { phone, address } = req.body;
      if (!phone || !address) {
        req.flash("error", "All fields are required");
        req.flash("phone", phone);
        req.flash("address", address);
        return res.redirect("/cart");
      }

      try {
        const order = new Order({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone: phone,
          address: address,
        });
        const orderData = await order.save();
        req.flash("success", "Order placed successfully");
        delete req.session.cart;
        return res.redirect("/customer/orders");
      } catch (err) {
        req.flash("error", "server side error");
        return res.redirect("/cart");
      }
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render("customers/singleOrder", { order: order });
      }
      return res.redirect("/");
    },
  };
}
module.exports = orderController;
