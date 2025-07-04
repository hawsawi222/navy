import { voiceClient } from "./client.js";
import tokens from "./tokens.js";
import express from 'express';
import { fetch } from 'undici';
import 'dotenv/config'; // مهم عشان يقرأ .env

const app = express();
const port = process.env.PORT || 3000;
const url = "https://four-aluminum-charger.glitch.me/";

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

// دوال مساعدة للتأخيرات العشوائية
const wait = (ms) => new Promise(res => setTimeout(res, ms));
const randomDelay = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ✅ تشغيل كل حساب بتأخير عشوائي بين 6 و12 ثانية لتجنب الطرد
const cleanTokens = tokens.filter(t => t?.token?.length > 30);

(async () => {
  for (const token of cleanTokens) {
    const client = new voiceClient(token);

    client.on('ready', (user) => {
      console.log(`✅ Logged in as ${user.username}#${user.discriminator}`);
    });

    client.on('connected', () => console.log('🌐 Connected to Discord'));

    // عند قطع الاتصال حاول تعيد الاتصال مع تأخير عشوائي بين 30 و 60 ثانية
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
    client.on('error', (e) => console.error('❗ Error:', e));
    client.on('debug', (msg) => console.debug(msg));

    await client.connect();

    // تأخير عشوائي بين 6 إلى 12 ثانية بين كل حساب
    await wait(randomDelay(6000, 12000));
  }
})();
