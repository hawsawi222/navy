// إضافة Polyfill لـ ReadableStream
require('web-streams-polyfill');

require("dotenv").config(); 

const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const keepAlive = require("./keepAlive.js");

// إنشاء العميل
const client = new Client();

// حدث: عندما يكون البوت جاهزًا
client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  
  const joinVoice = async () => {
    try {
      // محاولة استرجاع القناة الصوتية
      const channel = await client.channels.fetch(process.env.channel);
      if (channel) {
        joinVoiceChannel({
          channelId: channel.id,
          guildId: process.env.guild,
          selfMute: false,
          selfDeaf: false,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log(`Joined voice channel: ${channel.name}`);
      } else {
        console.error("Channel not found!");
      }
    } catch (error) {
      console.error("Error joining the voice channel:", error);
    }
  };

  // الانضمام إلى القناة الصوتية فورًا وتجديد الاتصال بشكل دوري
  joinVoice();
  setInterval(joinVoice, 60000); // محاولة الانضمام كل دقيقة
});

// إبقاء البوت قيد التشغيل
keepAlive();

// تسجيل الدخول باستخدام التوكن
client.login(process.env.TOKEN);
