const Order = require("../../../models/order");
const moment = require("moment");
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);
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
      const { phone, address, stripeToken, paymentType } = req.body;

      if (!phone || !address) {
        req.flash("error", "All fields are required");
        req.flash("phone", phone);
        req.flash("address", address);

        // return res.redirect("/cart");
        return res.status(422).json({ message: "error occurs" });
      }

      try {
        const order = new Order({
          customerId: req.user._id,
          items: req.session.cart.items,
          phone: phone,
          address: address,
        });
        const orderData = await order.save();
        Order.populate(
          orderData,
          { path: "customerId" },
          (err, placedOrder) => {
            // req.flash("success", "Order placed successfully");

            // stripe payment
            if (paymentType === "card") {
              stripe.charges
                .create({
                  amount: req.session.cart.totalPrice * 100,
                  source: stripeToken,
                  currency: "inr",
                  description: `pizza order:${placedOrder._id}`,
                })
                .then((re) => {
                  placedOrder.paymentStatus = true;
                  placedOrder.paymentType = paymentType;
                  placedOrder
                    .save()
                    .then((updatedOrder) => {
                      // Emit event
                      const eventEmitter = req.app.get("eventEmitter");
                      eventEmitter.emit("orderPlaced", updatedOrder);
                      delete req.session.cart;
                      return res.json({
                        message:
                          "payment successful, Order placed successfully",
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  delete req.session.cart;
                  return res.json({
                    message:
                      "payment failed,But order placed you can pay via cash on delivery",
                  });
                });
              return;
            }
            //  if not stripe payment
            // Emit event
            const eventEmitter = req.app.get("eventEmitter");
            eventEmitter.emit("orderPlaced", placedOrder);
            delete req.session.cart;
            return res.json({
              message: "Order placed successfully",
            });

            // return res.redirect("/customer/orders");
          }
        );
      } catch (err) {
        req.flash("error", "server side error");
        return res.status(500).json({
          message: "something went wrong failed to placed order",
        });
        // return res.redirect("/cart");
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
