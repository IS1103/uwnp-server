const log = require('./log');

class Main {
  config = {};
  plugins = {};
  middleware = [];
  runCompose = null;
  wss = null;

  constructor() {
  }

  use(middleware) {
    this.middleware.push(middleware);
  }
  set(key, plugin) {
    this.plugins[key] = plugin;
  }
  configure(key, config) {
    this.config[key] = config;
  }
  start() {

  }
}
module.exports = Main;