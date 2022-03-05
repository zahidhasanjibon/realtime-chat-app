import { loadStripe } from "@stripe/stripe-js";
import { placeOrderApi } from "./apiService";

export async function initStripe() {
  const paymentType = document.querySelector("#paymentType");
  const paymentForm = document.querySelector("#payment-form");

  const stripe = await loadStripe(
    "pk_test_51KZaXnLi0BHz4sSPie3mW9wcuRgniwBR2AdvDC6BH3rrWQw4n4zTP8YnO0IuXQ8oY3TkHOrdyfsV5sNnwMhp2q6l00GH3pPRJi"
  );
  let card = null;
  function mountWidget() {
    const elements = stripe.elements();
    let style = {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue",Helvetica,sans-serif',
        fontSmoothing: "antialised",
        fontSize: "16px",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#fa755a", iconColor: "#fa755a" },
    };
    card = elements.create("card", { style, hidePostalCode: true });
    card.mount("#card-element");
  }

  if (paymentType) {
    paymentType.addEventListener("change", (e) => {
      if (e.target.value === "card") {
        // display payment card
        mountWidget();
      } else {
        card.destroy();
      }
    });
  }

  // ajax call
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let formData = new FormData(paymentForm);
      let formObject = {};
      for (let [key, value] of formData.entries()) {
        formObject[key] = value;
      }
      // verify card // call to stripe server
      if (!card) {
        // ajax call for place order
        placeOrderApi(formObject);
      } else {
        stripe
          .createToken(card)
          .then((result) => {
            formObject.stripeToken = result.token.id;
            placeOrderApi(formObject);
          })
          .catch((err) => {});
      }
    });
  }
}
