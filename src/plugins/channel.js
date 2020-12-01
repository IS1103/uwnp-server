const PackageHandler = require('../middleware/pack/Codecs');
class Channel {

  /** 資料結構
   * {"uid1":session1,"uid2":session2,"uid3":session3,...}
   */
  usersSession = new Map();

  /** 綁定用戶與主頻道
  * @param uid 頻道名稱
  * @param session 可用來傳送檔案
  * @returns {boolean} 回傳綁定是否成功
  */
  bind(uid, session) {
    this.usersSession.set(uid, session);
    return this.usersSession.has(uid);
  }

  /** 解除綁定用戶與頻道
  * @param uid 頻道名稱
  * @param session 可用來傳送檔案
  * @returns {boolean} 回傳移除綁定是否成功
  */
  unbind(uid) {
    this.usersSession.delete(uid);
    return !this.usersSession.has(uid);
  }

  /** 推送訊息給指定的用戶
  * @param channelName 頻道名稱
  * @param route 完整路由
  * @param info 訊息
  * @param proto proto 格式
  * @returns {Array} 回傳沒有送達的用戶 uid
  */
  sendToUids(uids, route, info, proto) {
    let noUser = [];
    uids.forEach(uid => {
      if (this.usersSession.get(uid)) {
        this.send(this.usersSession.get(uid), route, info, proto);
      }
      else {
        noUser.push(uid);
      }
    });
    return noUser;
  }

  send(session, route, info, proto) {
    try {
      // console.log(this.usersSession);
      // log.info(route, "push >>>>" + JSON.stringify(info));
      let pack = PackageHandler.encodePush(route, info, proto);
      session.send(pack, { binary: true });
    } catch (error) {
      // console.log("push error >>>>");
      console.log(error);
    }
  }
}
module.exports = Channel;