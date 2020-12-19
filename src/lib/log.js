const log4js = require('log4js');
log4js.configure({
  appenders: [{
    "type": "console"
  }],
  "replaceConsole": true,
});
const logger = log4js.getLogger();

// console.trace("Entering cheese testing");
// console.debug("Got cheese.");
// console.info("Cheese is Comté.");
// console.warn("Cheese is quite smelly.");
// console.error("Cheese is too ripe!");

module.exports = logger;