const { voiceClient } = require('./client.js');
const tokens = require('./tokens.js');
const express = require('express');
const { fetch } = require('undici');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const url = process.env.URL || 'https://four-aluminum-charger.glitch.me/';

app.get('/', (req, res) => res.send('Don Monitoring System Active!'));
app.listen(port, () => console.log(`🚀 [DON MODE] Debugger running on port ${port}`));

// --- نظام صيد الأخطاء العالمي ---
process.on('uncaughtException', (err) => {
  console.error('🛑 [CRITICAL ERROR] Full Details:');
  console.error(`Message: ${err.message}`);
  console.error(`Code: ${err.code || 'N/A'}`);
  console.error(`Stack: ${err.stack}`); // هذا بيعلمنا السطر اللي فيه المشكلة بالضبط
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ [UNHANDLED REJECTION] at:', promise, 'reason:', reason);
});

setInterval(async () => {
  try {
    await fetch(url, { method: 'HEAD' });
  } catch (e) {
    console.log('📡 Render Keep-alive failed (Normal if URL is wrong)');
  }
}, 120000);

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

(async () => {
  const cleanTokens = tokens.filter((t) => t?.token?.length > 30);
  console.log(`📡 Starting Monitor for ${cleanTokens.length} accounts...`);
  
  for (const [index, tokenConfig] of cleanTokens.entries()) {
    const client = new voiceClient({
      token: tokenConfig.token,
      serverId: tokenConfig.serverId,
      channelId: tokenConfig.channelId,
      selfMute: tokenConfig.selfMute ?? true,
      selfDeaf: tokenConfig.selfDeaf ?? true,
      autoReconnect: { enabled: true, delay: 30000 },
      presence: tokenConfig.presence,
    });

    client.on('ready', (user) => {
      console.log(`✅ [ACCOUNT #${index + 1}] Verified as: ${user.username}`);
    });

    // لوق تفصيلي للديسكونكت
    client.on('disconnected', (code, reason) => {
      console.log(`⚠️ [ACCOUNT #${index + 1}] DISCONNECTED!`);
      console.log(`🔹 Error Code: ${code || 'Unknown'}`);
      console.log(`🔹 Reason: ${reason || 'No reason provided by Discord'}`);
    });

    // لوق الأخطاء البرمجية
    client.on('error', (err) => {
      console.error(`❌ [ACCOUNT #${index + 1}] SOCKET ERROR:`);
      console.error(`- Name: ${err.name}`);
      console.error(`- Msg: ${err.message}`);
      if (err.message.includes('4004')) console.error('👉 Tip: Your Token is DEAD/INVALID!');
      if (err.message.includes('4014')) console.error('👉 Tip: Missing Intent/Permissions!');
    });

    const startClient = async () => {
      try {
        await client.connect();
      } catch (e) {
        console.error(`❗ [ACCOUNT #${index + 1}] Initial Connection Failed: ${e.message}`);
      }
    };

    startClient();
    await wait(15000); // لا تنقصها عشان ما تتبند
  }
})();
