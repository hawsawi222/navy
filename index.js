import { voiceClient } from "./client.js";
import tokens from "./tokens.js";
import express from 'express';
import { fetch } from 'undici';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || "https://four-aluminum-charger.glitch.me/";

app.get('/', (req, res) => res.send('Hello World!'));
app.head('/', (req, res) => res.sendStatus(200));
app.listen(port, () => console.log(`Server running at ${url} on port ${port}`));

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

setInterval(async () => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    console.log(`HEAD ping (${response.status})`);
  } catch (error) {
    console.error('Ping error:', error);
  }
}, 300000); // كل 5 دقايق

const wait = ms => new Promise(res => setTimeout(res, ms));
const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const cleanTokens = tokens.filter(t => t?.token?.length > 30);

(async () => {
  for (const tokenConfig of cleanTokens) {
    const client = new voiceClient({
      token: tokenConfig.token,
      serverId: tokenConfig.serverId,
      channelId: tokenConfig.channelId,
      selfMute: tokenConfig.selfMute,
      selfDeaf: tokenConfig.selfDeaf,
      autoReconnect: tokenConfig.autoReconnect || { enabled: false },
      presence: tokenConfig.presence
    });

    client.on('ready', user => {
      console.log(`✅ Logged in as ${user.username}#${user.discriminator}`);
    });

    client.on('connected', () => console.log('🌐 Connected to Discord'));
    client.on('disconnected', async () => {
      console.log('❌ Disconnected — retrying after delay...');
      const delayMs = randomDelay(30000, 60000);
      await wait(delayMs);
      try {
        await client.connect();
      } catch (e) {
        console.error('❗ Reconnect failed:', e);
      }
    });

    client.on('voiceReady', () => console.log('🔊 Voice is ready'));
    client.on('error', e => console.error('❗ Error:', e));
    client.on('debug', msg => console.debug(msg));

    await client.connect();

    await wait(randomDelay(6000, 12000));
  }
})();
