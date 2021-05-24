const Codecs = require("./Codecs");
const PackageType = require("./Enum").packageType;
const ErrorBase = require("../../lib/baseClass/ErrorBase");
const log = require('../../lib/log');

class EncodePack {

    /** 把包轉成 byte[] 結構
     * @param {Session} context.session
     * @param {Package} context.request 請求資料
     * 
     * @param {object} context.response 已經經過 controller 處理的資料
     */
    async next(context, next) {
        let req = context.request;
        let session = context.session;
        let res = context.response;
        try {
            let responsePackage = Codecs.encode(req, res);

            if (req.packageType == PackageType.REQUEST)
                log.debug(">>>> Response " + JSON.stringify(res));

            session.send(responsePackage, { binary: true });
        } catch (error) {
            let res = {
                'err': error.code,
                'errMsg': error.message,
                'info': null
            };
            let errPack = Codecs.encode(req,);
            log.debug(">>>> EncodePack error：" + JSON.stringify(req), JSON.stringify(res));
            session.send(errPack, { binary: true });
        }
        next();
    }
}
module.exports = EncodePack;