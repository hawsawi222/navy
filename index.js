// استدعاء المتغيرات البيئية
require("dotenv").config();

// استدعاء المكتبات
const { Client } = require("discord.js-selfbot-v13");
const express = require("express");

// إنشاء سيرفر وهمي عشان يبقى شغال في Render
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is alive!");
});

app.listen(PORT, () => {
  console.log(`🌐 Server is running on port ${PORT}`);
});

// إنشاء العميل
const client = new Client();

// عند الجاهزية
client.on("ready", async () => {
  console.log(`🤖 ${client.user.username} is ready!`);

  try {
    const channel = await client.channels.fetch(process.env.channel);
    if (!channel || !channel.joinable) return console.log("❌ Can't join the channel");

    await channel.join();
    console.log(`✅ Joined voice channel: ${channel.name}`);
  } catch (err) {
    console.error("❌ Error joining voice channel:", err);
  }
});

// تسجيل الدخول بالحساب الشخصي
client.login(process.env.TOKEN);
