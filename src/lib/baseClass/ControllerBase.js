

class ControllerBase {
  app = null;
  channel = null;
  event = null;
  roomMgr = null;
  constructor(app) {
    this.channel = app.plugins.channel;
    this.event = app.plugins.event;
  }

  /**
   * @param {*} info 回傳的物件
   * @param {*} msg 訊息
   * @param {*} proto 可選，指定 proto 格式，預設為【方法名稱_S】
   */
  response(obj, info = null, msg = null, proto = null) {
    if (!info && !msg && !proto) {
      obj.next();
    } else {
      obj.context.response = {
        'err': 0,
        'errMsg': msg,
        'info': info == null ? null : info,
        'proto': proto
      };
      obj.next();
    }
  }

  responseError(err) {
    return {
      'err': err.code == null ? 1 : err.code,
      'errMsg': process.env['DEBUG'] == 'true' ? err.message + "," + err.stack : err.message,
      'info': null,
      'proto': null
    }
  }
}
module.exports = ControllerBase;