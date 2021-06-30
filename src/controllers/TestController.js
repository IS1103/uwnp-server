const ControllerBase = require('../lib/baseClass/ControllerBase');
const Error = require('../lib/baseClass/ErrorBase');

class TestController extends ControllerBase {
  constructor(app) {
    super(app);
    this.event.on('offline', this.onOffline.bind(this));
  }

  onOffline(uid) {
    console.log(uid, "offline ~");
  }

  /**request/response API
   * 
   * @param {*} session {uid}
   * @param {*} packObj {request info}
   * @param {*} next 
   */
  testA(session, packObj, next) {
    console.log(session.uid, "進入testA");
    this.response(next, { packageType: 123 });

    // 回傳錯誤不要用 responseError() ，而是用下列方式
    // throw new Error(Error.CODE.UNEXPECTED, "testA 錯誤訊息");
  }

  /**notify API */
  testB(session, packObj) {
    //1表示玩家uid，收到testB的通知，並發推送給client
    this.channel.sendToUids([1], 'TestController.testOn', { info: "ss" });
  }

  testC(session, packObj, next) {
    console.log(session.uid, "進入testC");
    this.response(next, { info: "520" }, null);

    // 回傳錯誤不要用 responseError() ，而是用下列方式
    // throw new Error(Error.CODE.UNEXPECTED, "testA 錯誤訊息");
  }
}
module.exports = TestController;