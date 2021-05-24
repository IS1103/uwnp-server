// 
const errorCodePath =require('../../errCode/systemErrorCode');
class ErrorBase extends Error {

  static CODE = errorCodePath;

  /**  
   * @param {int} code 錯誤碼 0：沒有錯誤 1：未知錯誤 
   * @param {string} msg 錯誤訊息
  */
  constructor(code, msg = null) {
    super();
    this.code = parseInt(code);
    if (this.code == null || this.code == undefined) {
      this.code = 1;
    }
    this.message = msg;
  }
}

module.exports = ErrorBase;