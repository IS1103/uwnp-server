const Codecs = require("./pack/Codecs");
const PackageType = require("./pack/Enum").packageType;
const ERROR_CODE = require("./pack/ErrorCode");
const ErrorBase = require("../lib/baseClass/ErrorBase");
const fs = require('fs');
const path = require('path');
const ctrlDirPath = __dirname + "/../controllers/";
const SystemController = require('../lib/SystemController');
const log = require('../lib/log');

class PackageGateway {

  app = null;
  controllers = {};

  static paths = [];

  constructor(app) {
    this.app = app;
    this.instanceController();
    // console.log(this.controllers.SystemController.heartbeat());
  }

  /** 載入所有 controller */
  instanceController() {
    this.controllers['SystemController'] = new SystemController(this.app);
    const files = fs.readdirSync(ctrlDirPath);
    const protoFiles = files
      .filter(fileName => fileName.endsWith('.js'))
      .map(fileName => path.join(ctrlDirPath, fileName));
    protoFiles.forEach((_path) => {
      let fileFullName = path.basename(_path);
      let fileName = path.basename(_path, '.js');
      this.controllers[fileName] = new (require(_path))(this.app);
    });
  }

  /** 根據包類型處理
   * @param {Session} context.session
   * @param {byte[]} context.data
   * 
   * @param {Package} context.request 請求資料
   * @param {int} context.request.packageType
   * @param {string} context.request.controller
   * @param {string} context.request.method
   * @param {string} context.request.route
   * @param {int} context.request.rqID
   * 
   * @param {object} context.request.json 請求的資料
   * @param {Onject} context.result 請求回傳資料
   */
  next(context, next) {
    let req = context.request;
    let session = context.session;

    let controller = req.controller;
    let method = req.method;
    let info = req.info;
    try {
      let response = null;
      switch (req.packageType) {
        case PackageType.HEARTBEAT:
          response = this.controllers.SystemController.heartbeat(session, info);
          break;
        case PackageType.REQUEST:
          log.debug("<<<< Request " + JSON.stringify(req));
          let tryCatchObj = this.controllers[controller][method](session, info, { context, next });
          if (tryCatchObj instanceof Promise) {
            tryCatchObj.catch(error => {
              this.returnThrow(error, PackageType, req, session);
            });
          }
          return;
        case PackageType.NOTIFY:
          log.debug("<<<< Notify " + JSON.stringify(req));
          let tryCatchObj2 = this.controllers[controller][method](session, info);
          if (tryCatchObj2 instanceof Promise) {
            tryCatchObj2.catch(error => {
              this.returnThrow(error, PackageType, req, session);
            });
          }
          return;
        case PackageType.HANDSHAKE:
          response = this.controllers.SystemController.handshake(session, info);
          break;
        default:
          log.debug("沒有符合的 packageType：", req.packageType);
          break;
      }
      context.response = response;
      next();
      // throw new ErrorBase(3340);
    } catch (error) {
      this.returnThrow(error, PackageType, req, session);
    }
  }

  returnThrow(_error, _PackageType, _req, _session) {
    let error = _error, PackageType = _PackageType, req = _req, session = _session;
    log.error("PackageGateway error:", error.message, error.stack);
    let errPack = null;
    let res = {
      'err': ERROR_CODE.UNEXPECTED,
      'errMsg': error.message,
      'info': null
    }
    if (error instanceof ErrorBase) res.err = error.code;
    let encodeInfo = {
      packageType: PackageType.RESPONSE,
      controller: req.controller,
      method: req.method,
      route: req.route,
      rqID: req.rqID,
      info: res
    }
    if (req.packageType == PackageType.REQUEST) {
      encodeInfo.packageType = PackageType.RESPONSE;
    } else {
      encodeInfo.packageType = PackageType.ERROR;
    }
    errPack = Codecs.encode(encodeInfo, res);
    // console.log(">>>> controller error： " + JSON.stringify(encodeInfo));
    session.send(errPack, { binary: true });
  }
}
module.exports = PackageGateway;