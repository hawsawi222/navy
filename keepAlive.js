const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

function keepAlive() {
  app.listen(10000, () => {
    console.log("🌐 Server is running on port 10000");
  });
}

module.exports = keepAlive;
