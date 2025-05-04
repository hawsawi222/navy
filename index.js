require("dotenv").config();
const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const keepAlive = require("./keepAlive.js");

const client = new Client();

client.on("ready", async () => {
  console.log(`🤖 ${client.user.username} is ready!`);

  const joinVoice = async () => {
    try {
      const channel = await client.channels.fetch(process.env.channel);
      if (channel) {
        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          selfMute: false,
          selfDeaf: false,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        console.log(`✅ Joined voice channel: ${channel.name}`);
      } else {
        console.log("❌ Channel not found!");
      }
    } catch (error) {
      console.error("❌ Error joining voice channel:", error);
    }
  };

  joinVoice();
  setInterval(joinVoice, 60000); // كل دقيقة يتأكد إنه في الروم
});

keepAlive();
client.login(process.env.TOKEN);
