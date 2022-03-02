// for cart page product incr decr delete routes

function productController() {
  return {
    delete(req, res) {
      let productQty = req.session.cart.items[req.body.id].qty;
      let productTotalPrice =
        req.session.cart.items[req.body.id].qty *
        req.session.cart.items[req.body.id].item.price;

      if (req.session.cart) {
        req.session.cart.totalQty = req.session.cart.totalQty - productQty;
        req.session.cart.totalPrice =
          req.session.cart.totalPrice - productTotalPrice;
        delete req.session.cart.items[req.body.id];
      }

      return res.json({
        totalQty: req.session.cart.totalQty,
        totalPrice: req.session.cart.totalPrice,
      });
    },
    increment(req, res) {
      if (req.session.cart) {
        req.session.cart.items[req.body.id].qty =
          req.session.cart.items[req.body.id].qty + 1;

        req.session.cart.totalQty = req.session.cart.totalQty + 1;
        req.session.cart.totalPrice =
          req.session.cart.totalPrice +
          req.session.cart.items[req.body.id].item.price;
      }
      return res.json({
        productPrice:
          req.session.cart.items[req.body.id].qty *
          req.session.cart.items[req.body.id].item.price,
        totalPrice: req.session.cart.totalPrice,
        totalQty: req.session.cart.totalQty,
      });
    },
    decrement(req, res) {
      if (req.session.cart) {
        req.session.cart.items[req.body.id].qty =
          req.session.cart.items[req.body.id].qty - 1;

        req.session.cart.totalQty = req.session.cart.totalQty - 1;
        req.session.cart.totalPrice =
          req.session.cart.totalPrice -
          req.session.cart.items[req.body.id].item.price;
      }
      return res.json({
        productPrice:
          req.session.cart.items[req.body.id].qty *
          req.session.cart.items[req.body.id].item.price,
        totalPrice: req.session.cart.totalPrice,
        totalQty: req.session.cart.totalQty,
      });
    },
  };
}
module.exports = productController;
