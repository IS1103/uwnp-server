[![License](https://img.shields.io/github/license/wsmd/ws-multipath.svg)](https://github.com/wsmd/ws-multipath/blob/master/LICENSE)

# 說明
- [UWNP由來](#UWNP由來)
- [服務端功能](#服務端功能)
- [環境設定](#環境設定)
- [啟動 game server](#啟動gameserver)
- [啟動修改自動重啟 game server](#啟動修改自動重啟gameserver)
- [連線握手規則Handshake](#連線握手規則Handshake)
- [新增API步驟](#新增API步驟)
- [回傳給客戶端錯誤的方法](#回傳錯誤)
- [Logger 設定](#Logger設定)
- [取得用戶上下線的方法](#取得用戶上下線的方法)
# UWNP由來
UWNP 全名是 unity+websocket+nodejs+protobuf 輕量級單線程連線框架，目的是讓開發者只專注在開發商業邏輯 API 。
# 服務端功能
* nodejs ES6 風格。
* 可快速指定環境設定。
* 幾乎零配置，撰寫 API 容易。
* 使用 Http 框架的 RPC
* 監聽用戶上下線
* 客戶端、服務端有四種溝通方法
  * request 客戶端發出請求
  * response 服務端回復請求
  * notify 客戶端通知，服務端不必回復
  * push 服務端主動發送訊息給客戶端
# 環境設定
所有自定義的 config 檔案皆在 configThemes。自定義遊戲設定的方法如下：創建一個資料夾，該檔名就是<環境名稱>，若沒輸入就是取得 default 資料夾，完成就會秀出<環境名稱> setup!
```shell
>npm run env
>input use env name:<環境名稱>
><環境名稱> setup!
```
# 啟動gameserver
```shell
>sudo npm start
```
# 啟動修改自動重啟gameserver
```shell
>sudo npm run dev
```
# 連線握手規則Handshake
src/lib/handshakeRule.js 這裡面設定

# 新增API步驟
## 增加 testA Request
1. 在 src/controller/ 增加 TestController.js（Controller 必寫）如下：
```javascript
const ControllerBase = require('../lib/baseClass/ControllerBase');
class TestController extends ControllerBase{

  /**request/response API
   * 
   * @param {*} session {uid}
   * @param {*} packObj {request info}
   * @param {*} next 
   */
  testA(session, packObj, next){
    this.response({ packageType: 123 });
  }
}
```
2. 在 src/proto/ 增加 TestController.proto（TestController 要跟 TestController.js同名） 如下：
```javascript
package TestController;
syntax = "proto3";
message testA_C {// _C 代表從 client 傳過來的資料結構，必寫
  uint32 packageType = 1;//順序1
}

message testA_S {// _S 代表從 server 回傳到 client 的資料結構，必寫
  uint32 packageType = 1;
}

message testA_P {// _P 代表從 server 推播到 client 的資料結構，必寫
  uint32 packageType = 1;
}
```
# 回傳給客戶端錯誤的方法
當服務端有任何錯誤需要回傳給客戶端的時候，必須使用 **ErrorBase.js** 這個檔案，路徑在 \src\lib\baseClass\ErrorBase.js 。也可以用 process.global.errorClassPath 
```javascript
const Error = require(process.global.errorClassPath);
throw new Error(Error.CODE.UNEXPECTED, "錯誤訊息");
```
# Logger設定
src/lib/log.js 這裡面設定
# 取得用戶上下線的方法
```javascript
class TestController extends ControllerBase{
  constructor(app) {
    super(app);
    this.event.on('offline', this.onOffline.bind(this));
  }
  onOffline(uid){
    console.log(uid,"offline~");
  }

  entry(session, packObj, next){
    //user entry,online
  }
}
```