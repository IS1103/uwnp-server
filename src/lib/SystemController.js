const ControllerBase = require('../lib/baseClass/ControllerBase');
const log = require('./log');
const GameUtil = require('../util/game');
const ERROR_CODE = require('../middleware/pack/ErrorCode');
const Auther = require('../util/auther');

class SystemController extends ControllerBase {

  /** 檢查是否在指定時間有回應列表 */
  heartbeatArr = new Map();

  constructor(app) {
    super(app);

    this.startCheckHeartbeat();
  }

  async startCheckHeartbeat() {
    let waitT = process.env['HARBEAT'];
    let val = process.env['HARBEAT'] / 1000;
    while (true) {
      console.debug("檢查心跳", this.heartbeatArr.size);
      let offlineTimesemp = GameUtil.getTimestamp();

      for (const [uid, { timestemp, session }] of this.heartbeatArr) {
        if ((offlineTimesemp - timestemp) > val) {
          console.debug("這傢伙離線了", uid);
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
        console.debug("這傢伙重新連線");
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
    console.debug(uid, "收到心跳");
    let obj = this.heartbeatArr.get(uid);
    obj.timestemp = GameUtil.getTimestamp();
    return this.response();
  }

  /**
   * 
   * @param {*} info 回傳的物件
   * @param {*} msg 訊息
   * @param {*} proto 可選，指定 proto 格式，預設為【方法名稱_S】
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