import axios from "axios";
import moment from "moment";
import Noty from "noty";
import { initAdmin } from "./admin";
import { initStripe } from "./stripe";
const socket = io();

const addToCart = document.querySelectorAll(".add-to-cart");
const cartCounter = document.querySelector("#cartCounter");
addToCart.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    let pizzaData = JSON.parse(btn.dataset.pizza);
    updateCart(pizzaData);
  });
});

const updateCart = (pizzaData) => {
  axios
    .post("/update_cart", pizzaData)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: "Item added to cart",
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: "error",
        timeout: 1000,
        progressBar: false,
        text: "something went wrong",
      }).show();
    });
};

// remove alert messagae after order placed
const alertMsg = document.querySelector("#success-alert");
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// for admin page markup

// single product update status

let statuses = document.querySelectorAll(".status-line");
let hiddenInput = document.querySelector("#hiddenInput");
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement("small");

const updateStatus = (order) => {
  statuses.forEach((status) => {
    status.classList.remove("step-completed");
    status.classList.remove("current");
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add("step-completed");
    }
    if (order.status === dataProp) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format("hh:mm A");
      status.appendChild(time);
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add("current");
      }
    }
  });
};
updateStatus(order);

// socket

// join
if (order) {
  socket.emit("join", `order_${order._id}`);
}
socket.on("orderUpdated", (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: "success",
    timeout: 1000,
    progressBar: false,
    text: "Order Updated",
  }).show();
});

// for admin order page real time data update

let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes("admin")) {
  initAdmin(socket);
  socket.emit("join", "adminRoom");
}

// increment decrement functionality for orders
let cartAreaPath = window.location.pathname;
if (cartAreaPath.includes("cart")) {
  // increment functionality
  let incrementCounterBtn = document.getElementsByClassName("increment");
  [...incrementCounterBtn].forEach((incrementBtn) => {
    incrementBtn.addEventListener("click", (e) => {
      let totalPrice = document.querySelector("#totalPrice");
      let productPriceWrapper = e.target.closest(".product-wrapper");
      let productPrice = productPriceWrapper.querySelector(".product-price");
      let counter = incrementBtn.previousElementSibling;
      let count = +counter.innerText;
      counter.innerText = count + 1;
      let productId = e.target.parentElement.dataset.pizzaid;
      axios
        .post("/increment_cart_product", {
          id: productId,
        })
        .then((res) => {
          totalPrice.innerText = `$${res.data.totalPrice}`;
          productPrice.innerText = `$${res.data.productPrice}`;
          cartCounter.innerText = res.data.totalQty;
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  // decrement functionality
  let decrementCounterBtn = document.getElementsByClassName("decrement");
  [...decrementCounterBtn].forEach((decrementBtn) => {
    decrementBtn.addEventListener("click", (e) => {
      let totalPrice = document.querySelector("#totalPrice");
      let productPriceWrapper = e.target.closest(".product-wrapper");
      let productPrice = productPriceWrapper.querySelector(".product-price");

      let counter = decrementBtn.nextElementSibling;
      let count = +counter.innerText;
      if (count === 1) {
        return;
      }
      counter.innerText = count - 1;
      let productId = e.target.parentElement.dataset.pizzaid;
      axios
        .post("/decrement_cart_product", {
          id: productId,
        })
        .then((res) => {
          totalPrice.innerText = `$${res.data.totalPrice}`;
          productPrice.innerText = `$${res.data.productPrice}`;
          cartCounter.innerText = res.data.totalQty;
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });

  // product delete functionality

  let allTrash = document.getElementsByClassName("trash");
  [...allTrash].forEach((trash) => {
    trash.addEventListener("click", (e) => {
      let productId = e.target.parentElement.dataset.pizzaid;
      e.target.closest(".flex").remove();

      axios
        .post("/delete_cart_product", { id: productId })
        .then((res) => {
          cartCounter.innerText = res.data.totalQty;
          totalPrice.innerText = res.data.totalPrice;
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
}

// payment functionality

if (cartAreaPath.includes("cart")) {
  initStripe();
}
