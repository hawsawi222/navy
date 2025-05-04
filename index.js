// إضافة Polyfill لـ ReadableStream
require('web-streams-polyfill');

require("dotenv").config(); 

const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const keepAlive = require("./keepAlive.js");

// إنشاء العميل
const client = new Client();

// تعريف الاتصال عشان نتحكم فيه
let connection;

// دالة للانضمام إلى القناة الصوتية
const joinVoice = async () => {
  try {
    const channel = await client.channels.fetch(process.env.channel);

    if (!channel) return console.error("Channel not found!");

    // إذا في اتصال قديم، لا تسوي شي
    const existing = getVoiceConnection(process.env.guild);
    if (existing && existing.state.status !== "destroyed") {
      console.log("Already connected to voice.");
      return;
    }

    // إذا في اتصال قديم لكن حالته معلقة، ندمّره أول
    if (existing) existing.destroy();

    // الاتصال الجديد
    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: process.env.guild,
      selfMute: false,
      selfDeaf: false,
      adapterCreator: channel.guild.voiceAdapterCreator,
    });

    console.log(`✅ Joined voice channel: ${channel.name}`);

    // استماع لأحداث الخطأ أو انقطاع الاتصال
    connection.on('error', (err) => {
      console.error("❌ Voice connection error:", err);
    });

    connection.on('stateChange', (oldState, newState) => {
      console.log(`🔄 Voice state: ${oldState.status} → ${newState.status}`);
    });

  } catch (error) {
    console.error("❌ Error joining the voice channel:", error);
  }
};

// لما يكون البوت جاهز
client.on("ready", async () => {
  console.log(`🤖 ${client.user.username} is ready!`);

  // اتصال مبدئي
  await joinVoice();

  // محاولات كل 5 دقايق فقط إذا الاتصال غير موجود
  setInterval(async () => {
    const existing = getVoiceConnection(process.env.guild);
    if (!existing || existing.state.status === "disconnected") {
      console.log("🔁 Trying to reconnect...");
      await joinVoice();
    }
  }, 5 * 60 * 1000); // كل 5 دقائق
});

// إبقاء البوت شغال
keepAlive();

// تسجيل الدخول
client.login(process.env.TOKEN);
