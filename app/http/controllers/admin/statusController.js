const Order = require("../../../models/order");

function statusController() {
  return {
    async update(req, res) {
      Order.updateOne(
        {
          _id: req.body.orderId,
        },
        {
          $set: {
            status: req.body.status,
          },
        },
        (err, data) => {
          if (err) {
            return res.redirect("/admin/orders");
          }
          return res.redirect("/admin/orders");
        }
      );
    },
  };
}
module.exports = statusController;
