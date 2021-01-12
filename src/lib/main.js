require('dotenv').config({ path: __dirname + '/../../config/.env' });
const compose = require('koa-compose');
const httpServ = require('https');
const WebSocket = require('ws');
const log = require('./log');

process.global = {};

class Main {
  config = {};
  plugins = {};
  middleware = [];
  runCompose = null;
  wss = null;

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

  }

  start() {
    this.setup();
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

      this.wss.on('connection', (session) => {
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