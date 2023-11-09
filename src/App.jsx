import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "./CheckoutForm";
import "./App.css";

const stripePromise = loadStripe("pk_test_51OAUfEJtD74K52FwOVJPJYiRaPOXSMlkptC3YDg4QXkoZw5ZUlsvL2K33ozZCiIuR1NgdWtsJvrXapnBAOdP7DfA00P4eOT6JD");

export default function App() {
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);
console.log(clientSecret)
  const options = {
    clientSecret,
    theme: 'stripe',
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm clientSecret={clientSecret}/>
        </Elements>
      )}
    </div>
  );
}