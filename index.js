require("dotenv").config();

const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const express = require("express");

// إنشاء سيرفر وهمي
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot is alive!"));
app.listen(PORT, () => console.log(`🌐 Server is running on port ${PORT}`));

// إنشاء العميل
const client = new Client();

// جاهزية الحساب
client.on("ready", async () => {
  console.log(`🤖 ${client.user.username} is ready!`);

  try {
    const channel = await client.channels.fetch(process.env.channel);

    if (!channel) return console.log("❌ Channel not found");

    joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator,
      selfMute: false,
      selfDeaf: false,
    });

    console.log(`✅ Joined voice channel: ${channel.name}`);
  } catch (err) {
    console.error("❌ Error joining voice channel:", err);
  }
});

// تسجيل الدخول
client.login(process.env.TOKEN);
