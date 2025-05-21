require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const keepAlive = require("./keepAlive");

const client = new Client();

const joinVoice = async () => {
  try {
    const channel = await client.channels.fetch(process.env.channel);
    if (!channel || !channel.members.has(client.user.id)) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        selfMute: false,
        selfDeaf: false,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      console.log(`✅ Rejoined voice channel: ${channel.name}`);
    } else {
      console.log(`👌 Still in channel: ${channel.name}`);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

client.on("ready", async () => {
  console.log(`🤖 ${client.user.username} is ready!`);
  joinVoice(); // أول دخول
  setInterval(joinVoice, 60 * 1000); // كل دقيقة يتأكد
});

// اشغل السيرفر الصغير اللي يمنع Render من النوم
keepAlive();

// شغل البوت
client.login(process.env.TOKEN);
