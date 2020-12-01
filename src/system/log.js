const log4js = require('log4js');
log4js.configure({
  appenders: { file: { type: "file", filename: "logs/server.log" }, console: { type: 'console' } },
  categories: { default: { appenders: ['file', 'console'], level: "all" } }
});
const logger = log4js.getLogger();
module.exports = logger;