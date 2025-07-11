module.exports = [
  {
    channelId: "1392580538300235846",
    serverId: "1109636583642103903",
    token: process.env.token1,
    selfDeaf: false,
    autoReconnect: {
      enabled: true,
      delay: 30000,
      maxRetries: 5,
    },
    presence: {
      status: "invisible",
    },
    selfMute: false,
  },
  {
    channelId: "1392580538300235846",
    serverId: "1109636583642103903",
    token: process.env.token2,
    selfDeaf: false,
    autoReconnect: {
      enabled: true,
      delay: 30000,
      maxRetries: 5,
    },
    presence: {
      status: "invisible",
    },
    selfMute: false,
  },
  {
    channelId: "1392580538300235846",
    serverId: "1109636583642103903",
    token: process.env.token3,
    selfDeaf: false,
    autoReconnect: {
      enabled: true,
      delay: 30000,
      maxRetries: 5,
    },
    presence: {
      status: "invisible",
    },
    selfMute: false,
  }
];
