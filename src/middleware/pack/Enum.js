const obj = {
  packageType: {
    HEARTBEAT: 1,
    REQUEST: 2,
    PUSH: 3,
    KICK: 4,
    RESPONSE: 5,
    HANDSHAKE: 6,
    ERROR: 7,
    NOTIFY: 8
  }
};
Object.freeze(obj);

module.exports = obj;