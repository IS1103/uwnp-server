
const protoPath = __dirname + "/../../proto/";
const protobuf = require("protobufjs");
const fs = require('fs');
const path = require('path');
const PackageType = require("./Enum").packageType;
const ERROR_CODE = require("./ErrorCode");
const log = require('../../lib/log');

class PackageHandler {

  static protoPackage = null;//= protobuf.loadSync([__dirname + "/../proto/package.proto"]);

  static loadProtoDir(dirPath) {
    const files = fs.readdirSync(dirPath);
    const protoFiles = files
      .filter(fileName => fileName.endsWith('.proto'))
      .map(fileName => path.join(dirPath, fileName));
    return protobuf.loadSync(protoFiles);
  }

  /** 反序列化（protobuf）
   * @param buff byte[]
   */
  static decode(buff) {
    let pack = PackageHandler.protoPackage.lookupType("package.Package");
    let packObj = pack.decode(buff);
    packObj = pack.toObject(packObj, { defaults: true });
    // console.log("packObj", packObj);
    let infoObj = null;
    if (packObj.route && packObj.buff != null) {
      let info = PackageHandler.protoPackage.lookupType(packObj.route + "_C");
      infoObj = info.decode(packObj.buff);
      infoObj = info.toObject(infoObj, { defaults: true });
    }
    // console.log("infoObj", infoObj);
    let api = packObj.route.split(".");
    let controller = null;
    let method = null;
    if (api.length > 1) {
      controller = api[0];
      method = api[1];
    }

    return {
      'packageType': packObj.packageType,
      'controller': controller,
      'method': method,
      'route': packObj.route,
      'rqID': packObj.rqID,
      'info': infoObj,
    };
  }

  /** 序列化（protobuf）
   * @param req.packageType 封包類型
   * @param req.controller 路由 controller
   * @param req.method 路由 method
   * @param req.route 完整路由
   * @param req.packName proto 格式
   * @param req.rqID 請求ID
   * @param res 要給 client 的資料 {err,errMsg,info,proto} 
   */
  static encode(req, res) {
    try {

      let packageType = req.packageType == PackageType.REQUEST ? PackageType.RESPONSE : req.packageType;
      let controller = req.controller;

      // console.log("====encode====");
      // console.log("req:", req);
      // console.log("res:", res);
      // console.log("====encode====");

      let payload = { 'packageType': packageType, 'route': req.route, 'rqID': req.rqID, 'buff': null };

      if (res.info == null || res.err > 0) {
        //處理 buff
        let messageResponse = PackageHandler.protoPackage.lookupType("package.Message");
        let messageResult = messageResponse.fromObject(res, { defaults: true, objects: true, oneofs: true });
        let bufferResult = messageResponse.encode(messageResult).finish();
        payload.buff = bufferResult;

        //處理 PackageResponse
        let PackageResponse = PackageHandler.protoPackage.lookupType("package.Package");
        let message = PackageResponse.create(payload);
        let buffer = PackageResponse.encode(message).finish();
        return buffer;
      }
      else {

        let _protoStr = res.proto == null ? req.route + "_S" : req.controller + '.' + res.proto;

        //處理 info
        let infoResponse = PackageHandler.protoPackage.lookupType(_protoStr);
        let infoResult = infoResponse.fromObject(res.info, { defaults: true, objects: true, oneofs: true });
        let infoBufferResult = infoResponse.encode(infoResult).finish();

        //處理 buff
        let messageResponse = PackageHandler.protoPackage.lookupType("package.Message");
        let messageResult = messageResponse.fromObject({ "err": res.err, "errMsg": res.errMsg, "info": null }, { defaults: true, objects: true, oneofs: true });
        messageResult.info = infoBufferResult;
        let bufferResult = messageResponse.encode(messageResult).finish();
        payload.buff = bufferResult;

        //處理 PackageResponse
        let PackageResponse = PackageHandler.protoPackage.lookupType("package.Package");
        let message = PackageResponse.create(payload);
        let buffer = PackageResponse.encode(message).finish();

        return buffer;
      }
    } catch (error) {
      log.error(error);
      throw new Error(ERROR_CODE.PACKAG_ENCODE, error.message);
    }
  }

  static encodePush(route, info, proto) {
    let payload = { packageType: PackageType.PUSH, route, buff: null };
    //縮減 push route
    route = route.split(".");
    payload.route = route[1];

    let protoModel = route[0] + "." + route[1];
    if (proto != null) {
      protoModel = route[0] + "." + proto;
    }
    if (info != null) {
      //處理 buff
      let messageResponse = PackageHandler.protoPackage.lookupType(protoModel + "_P");
      let messageResult = messageResponse.fromObject(info, { defaults: true, objects: true, oneofs: true });
      payload.buff = messageResponse.encode(messageResult).finish();
    }

    //處理 PackageResponse
    let PackageResponse = PackageHandler.protoPackage.lookupType("package.Package");

    let message = PackageResponse.create(payload);
    let buffer = PackageResponse.encode(message).finish();
    return buffer;
  }
}

PackageHandler.protoPackage = PackageHandler.loadProtoDir(protoPath);
module.exports = PackageHandler;