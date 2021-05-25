const ControllerBase = require('../lib/baseClass/ControllerBase');
const Error = require('../lib/baseClass/ErrorBase');

class TestController extends ControllerBase {

  async testA(session, packObj, next) {
    this.response(next, { packageType: 123 });

    // 回傳錯誤不要用 responseError() ，而是用下列方式
    // throw new Error(Error.CODE.UNEXPECTED, "錯誤訊息");
  }

  async testB(session, packObj) {
    //1表示玩家uid，收到testB的通知，並發推送給client
    this.channel.sendToUids([1], 'TestController.testOn', { info: "ss" });
  }
}
module.exports = TestController;