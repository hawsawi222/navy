require("dotenv").config(); 
const { Client } = require("discord.js-selfbot-v13");

// إنشاء العميل
const client = new Client();

// إضافة إبقاء البوت قيد التشغيل
const keepAlive = require("./keepAlive.js");

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

// إبقاء البوت قيد التشغيل
keepAlive();  // هذا السطر مهم عشان البوت يظل شغال

// تسجيل الدخول
client.login(process.env.TOKEN);
