
const log4js = require('log4js');
log4js.configure({
  appenders: { serverLog: { type: "file", filename: "logs/server.log" }, console: { type: 'console' } },
  categories: { default: { appenders: ['serverLog', 'console'], level: "all" } }
});
console.log(222);
console.debug(222);
console.error(666);
const logger = log4js.getLogger();
logger.trace("Entering cheese testing");
logger.debug("Got cheese.");
logger.info("Cheese is Comté.");
logger.warn("Cheese is quite smelly.");
logger.error("Cheese is too ripe!");
logger.fatal("Cheese was breeding ground for listeria.");

console.info = function () {
  // logger.info.call(null, arguments);
  logger.info(arguments);
}
console.info('null', 9, { s: 5 });
console.log("s", { '5': 99 });

class Main {
  config = {};
  plugins = {};
  middleware = [];
  runCompose = null;
  wss = null;

  constructor() {
    this.setupLog();
  }

  setupLog() {

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