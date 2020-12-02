const Codecs = require('./Codecs');
const PackageType = require("./Enum").packageType;
const ERROR_CODE = require("./ErrorCode");
const log = require('../../system/log');

class DecodePack {

    /** 把 byte[] 轉成包結構
     * @param {Session} context.session
     * @param {byte[]} context.request
    */
    async next(context, next) {
        try {
            let buff = context.request;
            let req = Codecs.decode(buff);
            context.request = req;
            await next();
        } catch (error) {
            log.error("DecodePack error:", error);
            let req = {
                packageType: PackageType.ERROR,
                controller: '',
                proto: '',
                route: '',
                rqID: 0,
            }
            let res = {
                'err': error.code,
                'errMsg': error.message,
                'info': null
            };
            let errPack = Codecs.encode(req, res);
            log.debug(">>>> DecodePack error：" + JSON.stringify(req), JSON.stringify(res));
            context.session.send(errPack, { binary: true });
        }
    }
}

module.exports = DecodePack;