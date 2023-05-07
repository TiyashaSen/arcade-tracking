const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { response } = require("express");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + "/dist/arcade-token-system"));

let tokenPrice = 0.25;
let userTokens = 0;
let transactions = [];

// Purchase tokens endpoint
app.post("/purchase", (req, res) => {
  const { amount, description } = req.body;

  const cost = amount * tokenPrice;
  userTokens += amount;
  transactions.push({
    description: description,
    type: "purchase",
    amount: amount,
    cost: cost,
    date: new Date(),
    status: "Purchased",
  });
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).json({
    message: "Tokens purchased successfully!",
    tokens: userTokens,
    transaction: {
      description: description,
      amount: amount,
      cost: cost,
      date: new Date(),
      status: "Purchased",
    },
  });
});

// Spend tokens endpoint
// Spend tokens endpoint
app.post("/spend", (req, res) => {
  const { amount, description } = req.body;
  const remainingTokens = userTokens - amount;
  if (remainingTokens < 4) {
    res.status(400).json({
      message: "You must keep a minimum balance of 4 tokens!",
    });
  } else if (amount > userTokens || userTokens <= 4) {
    res.status(400).json({
      message: "Insufficient tokens to play the game!",
    });
  } else {
    userTokens -= amount;
    transactions.push({
      description: description,
      type: "spend",
      amount: amount,
      date: new Date(),
      status: "Spent",
    });
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.status(200).json({
      message: "Tokens spent successfully!",
      tokens: userTokens,
      transaction: {
        description: description,
        amount: amount,
        date: new Date(),
        status: "Spent",
      },
    });
  }
});

// Get current token balance
app.get("/tokens", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.status(200).json({ tokens: userTokens * tokenPrice });
});

// Get transaction history
app.get("/transactionsHistory", (req, res) => {
  res.status(200).json({ transactions: transactions });
});

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname + "/dist/arcade-token-system/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
