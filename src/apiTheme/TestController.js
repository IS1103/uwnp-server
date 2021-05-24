const ControllerBase = require('../lib/baseClass/ControllerBase');
const Error = require('../lib/baseClass/ErrorBase');

class TestController extends ControllerBase {

  //request & response API
  async testA(session, packObj, next) {
    this.response(next, { packageType: 123 });

    // return this.response({ packageType: 123 }, null, 'testA_S');
    // throw new Error(3, "錯誤訊息");
  }

  //notify API
  async testB(session, packObj) {
    // this.channel.sendToUids([1], 'TestController.testOn', { info: "ss" });
    throw new Error(3, "錯誤訊息");
  }
}
module.exports = TestController;