const WebSocket = require('ws');
const EventEmitter = require('events');

const blackListedEvents = ["CHANNEL_UNREAD_UPDATE", "CONVERSATION_SUMMARY_UPDATE", "SESSIONS_REPLACE"];
const GATEWAY_URL = 'wss://gateway.discord.gg/?v=10&encoding=json';
const statusList = ["online", "idle", "dnd", "invisible", "offline"];

class voiceClient extends EventEmitter {
  constructor(config) {
    super();
    if (!config.token) throw new Error('token is required');
    this.ws = null;
    this.heartbeatInterval = null;
    this.sequenceNumber = null;
    this.firstLoad = true;
    this.reconnectAttempts = 0;
    this.ignoreReconnect = false;
    this.reconnectTimeout = null;
    this.invalidSession = false;
    this.token = config.token;
    this.guildId = config.serverId;
    this.channelId = config.channelId;
    this.selfMute = config.selfMute ?? true;
    this.selfDeaf = config.selfDeaf ?? true;
    this.autoReconnect = {
      enabled: config.autoReconnect?.enabled ?? false,
      delay: (config.autoReconnect?.delay ?? 1) * 1000,
      maxRetries: config.autoReconnect?.maxRetries ?? 9999,
    };
    this.presence = config.presence ?? null;
    this.user_id = null;
    this.connected = false;
  }

  connect() {
    if (this.invalidSession || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) return;
    
    this.cleanup(); // تنظيف أي مخلفات اتصال قديم قبل البدء
    this.ws = new WebSocket(GATEWAY_URL, { skipUTF8Validation: true });

    this.ws.on('open', () => {
      this.connected = true;
      this.emit('connected');
      this.emit('debug', '🌐 Connected to Discord Gateway');
    });

    this.ws.on('message', (data) => {
      const payload = JSON.parse(data.toString());
      const { t: eventType, s: seq, op, d } = payload;
      if (blackListedEvents.includes(eventType)) return;
      if (seq !== null) this.sequenceNumber = seq;

      switch (op) {
        case 10:
          this.startHeartbeat(d.heartbeat_interval);
          this.identify();
          break;
        case 11:
          this.emit('debug', 'Heartbeat acknowledged');
          break;
        case 9:
          this.invalidSession = true;
          this.ws?.terminate();
          setTimeout(() => { this.invalidSession = false; this.connect(); }, 5000);
          break;
        case 0:
          if (eventType === 'READY') {
            this.user_id = d.user.id;
            this.emit('ready', { username: d.user.username, discriminator: d.user.discriminator });
            // تأخير بسيط قبل دخول الروم لضمان استقرار الجلسة
            setTimeout(() => {
                this.joinVoiceChannel();
                this.sendStatusUpdate();
            }, 2000);
          }
          break;
      }
    });

    this.ws.on('close', (code) => {
      this.connected = false;
      this.cleanup();
      this.emit('disconnected', code);
      if (code !== 4004 && !this.invalidSession) {
         setTimeout(() => this.connect(), 5000);
      }
    });

    this.ws.on('error', (err) => this.emit('error', err));
  }

  startHeartbeat(interval) {
    if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ op: 1, d: this.sequenceNumber }));
      }
    }, interval);
  }

  identify() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        op: 2,
        d: {
          token: this.token,
          intents: 128, // Intent for Guild Voice States
          properties: { os: 'Windows', browser: 'Chrome', device: '' },
        },
      }));
    }
  }

  joinVoiceChannel() {
    if (!this.guildId || !this.channelId || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.ws.send(JSON.stringify({
      op: 4,
      d: {
        guild_id: this.guildId,
        channel_id: this.channelId,
        self_mute: this.selfMute,
        self_deaf: this.selfDeaf,
      },
    }));
    this.emit('debug', '🎤 Voice join request sent');
  }

  sendStatusUpdate() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    const status = this.presence?.status?.toLowerCase();
    if (!status || !statusList.includes(status)) return;
    this.ws.send(JSON.stringify({
      op: 3,
      d: {
        status: this.presence.status,
        activities: [],
        since: Date.now(),
        afk: true,
      },
    }));
  }

  cleanup() {
    if (this.heartbeatInterval) {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
    }
    if (this.ws) {
        this.ws.removeAllListeners();
        if (this.ws.readyState === WebSocket.OPEN) this.ws.close();
        this.ws = null;
    }
  }
}

module.exports = { voiceClient };
