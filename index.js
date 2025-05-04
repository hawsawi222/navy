require("dotenv").config(); 
const { Client } = require("discord.js-selfbot-v13");

// إنشاء العميل
const client = new Client();

// حدث: جاهزية الحساب
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

// تسجيل الدخول
client.login(process.env.TOKEN);
