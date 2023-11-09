const express = require("express");
const app = express();
// This is your test secret API key.
const stripe = require("stripe")('sk_test_51OAUfEJtD74K52Fw2MZ3LkdRAvbyBNXV5hMqFpGxax31Qb3Xnkzji6HnyG1Z1OEWSII9kdp0I3Yf9rQyNBLR4Saf00QS3f9xgz');

app.use(express.static("public"));
app.use(express.json());

app.post("/create-payment-intent", async (req, res) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1800,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.listen(4242, () => console.log("Node server listening on port 4242!"));