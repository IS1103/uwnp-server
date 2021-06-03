const log4js = require('log4js');
log4js.configure({
  appenders: [
    {
      type: "console",
      category: "console"
    },
    {
      type: 'logLevelFilter',
      appender: {
        type: 'file',
        filename: 'logs/server.log',
        maxLogSize : 20480,// bytes
        backups:3//log file limit
      },
      category: 'console',
      level: 'ERROR'//show trace,error,
    },
  ],
  "replaceConsole": true,
});

var logger = log4js.getLogger('console');

// console.trace("Entering cheese testing");
// console.debug("Got cheese.");
// console.info("Cheese is Comté.");
// console.warn("Cheese is quite smelly.");
// console.error("Cheese is too ripe!");

module.exports = logger;