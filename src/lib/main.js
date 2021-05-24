require('dotenv').config({ path: __dirname + '/../../config/.env' });
const compose = require('koa-compose');
const httpServ = require('https');
const WebSocket = require('ws');
const log = require('./log');

process.global = {};
const appDir = require('path').dirname(require.main.filename);
process.global.errorClassPath = appDir+'/lib/baseClass/ErrorBase';
const Error = require(process.global.errorClassPath);

class Main {
  config = {};
  plugins = {};
  middleware = [];
  runCompose = null;
  wss = null;
  isSetup = false;

  constructor() {
    this.runCompose = compose(this.middleware);
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

  setup() {
    this.isSetup = true;
    
    // process.on('unhandledRejection', error => {
    //   console.error('unhandledRejection', error);
    //   // process.exit(1) // To exit with a 'failure' code
    // });
  }

  start() {
    if (!this.isSetup) {
      throw new Error(Error.CODE.NO_SETUP_METHOD,'pleace call setup() method first！');
    }
    this.startRPC();
    this.startWebserver();
  }

  startRPC() {
  
  }

  //socket 握手驗證版本
  verifyClient(info, next) {
    let clientAppVersion = (info.req.url.split("="))[1];
    let appVersion = process.env['APP_VERSION'];
    if (clientAppVersion !== appVersion) {
      next(false);
      return;
    }
    next(true);
  }

  startWebserver() {
    try {
      this.wss = new WebSocket.Server({
        port: this.config.server.port,
        verifyClient: this.verifyClient
      });

      this.wss.on('connection', (session, req) => {
        ;
        console.log(session._socket.address());
        session.on('message', (data) => {
          this.runCompose({ request: data, session });
        });
        session.on('error', () => {
          this.plugins.event.emit('sessionError', session)
        });
        session.on('close', () => {
          this.plugins.event.emit('sessionClose', session)
        });
      });
      console.info("Start potr:" + this.config.server.port);
    } catch (error) {
      console.error("Start server error:", error);
    }
  }
}

module.exports = Main;