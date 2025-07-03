export default [
  {
    channelId: "1388953501534781471", 
    serverId: "1133667699151618130",
    token: process.env.token1,
    selfDeaf: false,
    autoReconnect: {
      enabled: true,
      delay: 5,
      maxRetries: 5,
    },
    presence: {
      status: "invisible",
    },
    selfMute: false,
  },
];
