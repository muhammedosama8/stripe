import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
  LinkAuthenticationElement
} from "@stripe/react-stripe-js";

export default function CheckoutForm({clientSecret}) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }
  }, [stripe]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error,paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000",
      },
      redirect: 'if_required'
    });

    if (error?.type === "card_error" || error?.type === "validation_error") {
      setMessage(error.message);
    } else if(paymentIntent && paymentIntent.status === 'succeeded'){
      setMessage("Done.");
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    clientSecret
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement />

      <PaymentElement 
        id="payment-element" 
        options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit" type="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}