module.exports = [
  {
    channelId: "1243695238392840273",
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
    channelId: "1243695238392840273",
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
    channelId: "1243695238392840273",
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
