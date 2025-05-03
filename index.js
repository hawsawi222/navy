require("dotenv").config(); 

const { Client } = require("discord.js-selfbot-v13");
const { joinVoiceChannel } = require("@discordjs/voice");
const keepAlive = require("./keepAlive.js");

// Create the client instance
const client = new Client();

// Event: Bot is ready
client.on("ready", async () => {
  console.log(`${client.user.username} is ready!`);
  
  const joinVoice = async () => {
    try {
      const channel = await client.channels.fetch(process.env.channel);
      joinVoiceChannel({
        channelId: channel.id,
        guildId: process.env.guild,
        selfMute: false,
        selfDeaf: false,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      console.log(`Joined voice channel: ${channel.name}`);
    } catch (error) {
      console.error("Error joining the voice channel:", error);
    }
  };

  // Join voice channel immediately and refresh periodically
  joinVoice();
  setInterval(joinVoice, 60000); // Attempt to join every minute
});

// Keep the bot alive
keepAlive();

// Login with the token
client.login(process.env.TOKEN);
