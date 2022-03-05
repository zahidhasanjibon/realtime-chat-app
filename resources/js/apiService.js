import axios from "axios";
import Noty from "noty";
export function placeOrderApi(formObject) {
  axios
    .post("/orders", formObject)
    .then((res) => {
      new Noty({
        type: "success",
        timeout: 1000,
        progressBar: false,
        text: res.data.message,
      }).show();
      setTimeout(() => {
        window.location.href = "/customer/orders";
      }, 1000);
    })
    .catch((err) => {
      window.location.href = "/cart";

      console.log(err);
    });
}
