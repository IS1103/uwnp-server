# 說明

## 啟動 game server
```shell
>sudo npm start
```
## 啟動修改自動重啟 game server
```shell
>sudo npm test
```
## 新增API步驟
### 增加 testA Request
1. 在 src/controller/ 增加 ClassNameController.js 如下：
```javascript
const ControllerBase = require('../lib/baseClass/ControllerBase');
class ClassNameController extends ControllerBase{
  testA(session, packObj){
    return this.response({ packageType: 123 });
  }
}
```
2. 在 src/proto/ 增加 ClassNameController.proto 如下：
```proto
package TestController;
syntax = "proto3";
message testA_C {//預設方法名稱為 testA _C 代表從 client 傳過來的資料結構，必寫
  uint32 packageType = 1;
}

message testA_S {// _S 代表從 server 回傳到 client，比寫
  uint32 packageType = 1;
}
```