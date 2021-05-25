const ControllerBase = require('../lib/baseClass/ControllerBase');
const log = require('./log');
const GameUtil = require('../util/game');
const Auther = require('../util/auther');

class SystemController extends ControllerBase {

  /** Check response at the specified time  */
  heartbeatArr = new Map();

  constructor(app) {
    super(app);

    this.startCheckHeartbeat();
  }

  async startCheckHeartbeat() {
    let waitT = process.env['HARBEAT'];
    let val = process.env['HARBEAT'] / 1000;
    while (true) {
      // console.debug("check heartbeat", this.heartbeatArr.size);
      let offlineTimesemp = GameUtil.getTimestamp();

      for (const [uid, { timestemp, session }] of this.heartbeatArr) {
        if ((offlineTimesemp - timestemp) > val) {
          // console.debug("this guy offline", uid);
          this.channel.unbind(session);
          session.close(1000, "NO_HEARTBEAT");
          this.heartbeatArr.delete(uid);
          this.event.emit('offline', uid);
        } else {
          this.event.emit('online', uid);
        }
      }
      await (GameUtil.delay(waitT)).promise;
    }
  }

  handshake(session, packObj) {
    try {
      // console.info(packObj);
      let obj = this.decryptToken(packObj.token);
      let uid = parseInt(obj.uid);
      session.uid = uid;
      if (this.heartbeatArr.has(uid)) {
        // console.debug("this guy reonline");
        this.heartbeatArr.get(uid).session.close(1000, "NO_HEARTBEAT");
      }
      this.heartbeatArr.set(uid, { 'timestemp': GameUtil.getTimestamp(), session });
      this.channel.bind(uid, session);
      return this.response(
        { heartbeat: parseInt(process.env['HARBEAT']) });
    } catch (error) {
      return this.responseError(error);
    }
  }

  decryptToken(token) {
    const key = Buffer.from(process.env['APP_KEY'], 'utf8');
    const iv = Buffer.from(process.env['APP_KEY_IV'], 'utf8');
    let obj = Auther.decrypt(token, key, iv);
    obj = JSON.parse(obj);
    return obj;
  }

  heartbeat(session, packObj) {
    let uid = parseInt(session.uid);
    // console.debug(uid, "get heartbeat");
    let obj = this.heartbeatArr.get(uid);
    obj.timestemp = GameUtil.getTimestamp();
    return this.response();
  }

  /**
   * 
   * @param {*} info response
   * @param {*} msg option
   * @param {*} proto option,proto format default [methodName_S]
   */
  response(info = null, msg = null, proto = null) {
    return {
      'err': 0,
      'errMsg': msg,
      'info': info == null ? null : info,
      'proto': proto
    }
  }
}
module.exports = SystemController;