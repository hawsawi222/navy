const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

module.exports = function keepAlive() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
