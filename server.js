const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();

app.use(cors());
app.use(bodyParser.json());

let tokenPrice = 0.25;
let userTokens = 0;
let transactions = [];

// Purchase tokens endpoint
app.post("/purchase", (req, res) => {
  const { amount, description } = req.body;
  transactions.push(req.body);
  const cost = amount * tokenPrice;
  userTokens += amount;
  res.status(200).json({
    message: "Tokens purchased successfully!",
    tokens: userTokens,
    transaction: {
      description: description,
      amount: amount,
      cost: cost,
      date: new Date(),
    },
  });
});

// Spend tokens endpoint
app.post("/spend", (req, res) => {
  const { amount, description } = req.body;
  transactions.push(req.body);
  if (amount > userTokens) {
    res.status(400).json({
      message: "Insufficient tokens!",
    });
  } else {
    userTokens -= amount;
    res.status(200).json({
      message: "Tokens spent successfully!",
      tokens: userTokens,
      transaction: {
        description: description,
        amount: amount,
        date: new Date(),
      },
    });
  }
});

app.get("/transactionsHistory", (req, res) => {
  res.status(200).json({ transactions });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
