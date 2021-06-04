const Auther = require('../util/auther');
class ConfirmEntryRule {
    static check(packObj) {
        let obj = ConfirmEntryRule.decryptToken(packObj.token);
        return parseInt(obj.uid);
    }

    static decryptToken(token) {
        const key = Buffer.from(process.env['APP_KEY'], 'utf8');
        const iv = Buffer.from(process.env['APP_KEY_IV'], 'utf8');
        let obj = Auther.decrypt(token, key, iv);
        obj = JSON.parse(obj);
        return obj;
    }
}
module.exports = ConfirmEntryRule;