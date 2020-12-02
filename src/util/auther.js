const crypto = require('crypto');
const Error = require('../system/baseClass/ErrorBase');
const ERROR_CODE = require('../../config/errorCode/sys');

class Auther {
  static encrypt(src, key, iv) {
    try {
      let sign = '';
      const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
      sign += cipher.update(src, 'utf8', 'hex');
      sign += cipher.final('hex');
      return sign;
    } catch (error) {
      throw new Error(ERROR_CODE.FAILED_ENCRYPT, "無法加密");
    }
  }

  static decrypt(sign, key, iv) {
    try {
      let src = '';
      const cipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
      src += cipher.update(sign, 'hex', 'utf8');
      src += cipher.final('utf8');
      return src;
    } catch (error) {
      throw new Error(ERROR_CODE.FAILED_VERIFICATION, "無法解密");
    }
  }
}
module.exports = Auther;