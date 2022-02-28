import axios from "axios";
import moment from "moment";
import Noty from "noty";
import { initAdmin } from "./admin";
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
initAdmin(socket);

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
  socket.emit("join", "adminRoom");
}
