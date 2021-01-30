const ControllerBase = require('../lib/baseClass/ControllerBase');
const Error = require('../lib/baseClass/ErrorBase');
const log = require('../lib/log');
const GameUtil = require('../util/game');
const ERROR_CODE = require('../middleware/pack/ErrorCode');


class TestController extends ControllerBase {

  async testA(session, packObj, next) {
    await GameUtil.delay(5000).promise;
    this.response(next, { packageType: 123 });

    // return this.response({ packageType: 123 }, null, 'testA_S');
    // throw new Error(3, "錯誤訊息");
  }

  async testB(session, packObj) {
    log.debug("收到testB的通知，即將發推送給client");
    //1表示玩家uid
    // this.channel.sendToUids([1], 'TestController.testOn', { info: "ss" });
    throw new Error(3, "錯誤訊息");
  }
}
module.exports = TestController;