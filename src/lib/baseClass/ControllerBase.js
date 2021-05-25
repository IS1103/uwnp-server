

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
   * @param {*} info response
   * @param {*} msg option,message
   * @param {*} proto option，proto format default [methodName_S]
   */
  response(obj, info = null, msg = null, proto = null) {
    obj.context.response = {
      'err': 0,
      'errMsg': msg,
      'info': info == null ? null : info,
      'proto': proto
    };
    obj.next();
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