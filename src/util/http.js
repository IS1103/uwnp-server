const Https = require('https');
const Http = require('http');
const log = require('../lib/log');

class Httper {
  static delay(millisec) {
    let timeout, promise;
    promise = new Promise((resolve, reject) => {
      timeout = setTimeout(() => {
        resolve('timeout done');
      }, millisec);
    });

    return {
      promise: promise,
      cancel: () => { clearTimeout(promise); }
    };
  };
  // 呼叫https
  static async Request(_options, _data, _isHttps = true) {

    let rq = (options, data, isHttps) => {
      data = JSON.stringify(data);
      log.info(`web request ${options.method} >>>> ${options.agent.protocol}${options.agent.options.host}:${options.agent.options.port}${options.path} [data]${JSON.stringify(data)}`);
      return new Promise((resolve, reject) => {
        options.timeout = 3000;
        let req = (isHttps ? Https : Http).request(options, (res) => {
          let result = {};
          res.setEncoding('UTF8');
          res.on('data', (chunk) => {
            result = chunk;
          });
          res.on('end', () => {
            result = JSON.parse(result);
            log.info(`web request ${options.method} <<<< ${options.agent.protocol}${options.agent.options.host}:${options.agent.options.port}${options.path} [data]${JSON.stringify(result)}`);
            resolve(result);
          });
        });
        req.on('error', (e) => {
          log.error(`web request error ${options.method} <<<< ${options.agent.protocol}${options.agent.options.host}:${options.agent.options.port}${options.path} [data]${e}`);
          reject(e);
        });
        req.on('timeout', (e) => {
          log.error(`web request timeout ${options.method} <<<< ${options.agent.protocol}${options.agent.options.host}:${options.agent.options.port}${options.path} [data]${e}`);
          reject(e);
        });
        req.write(data);
        req.end();
      });
    }
    let retry = 5;
    let _error = null;
    do {
      try {
        let a = await rq(_options, _data, _isHttps);
        return a;
      } catch (error) {
        log.error(error);
        _error = error;
        let t = Httper.delay(1000);
        await t.promise;
      }
    } while (retry-- > 0);
    throw new Error(JSON.stringify(_error))
  }
}
module.exports = Httper;