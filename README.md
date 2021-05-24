# 說明

## 環境設定
所有自定義的 config 檔案皆在 configThemes，創建一個資料夾，該檔名就是<環境名稱>，若沒輸入就是取得 default 資料夾，完成就會秀出<環境名稱> setup!
```shell
>bash shell.sh
>input use env name:<環境名稱>
><環境名稱> setup!
```

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
message testA_C {// _C 代表從 client 傳過來的資料結構，必寫
  uint32 packageType = 1;
}

message testA_S {// _S 代表從 server 回傳到 client，必寫
  uint32 packageType = 1;
}
```
## 回傳錯誤
當有任何錯誤需要回傳的時候，必須要用 **ErrorBase.js** 這個檔案，路徑在 \src\lib\baseClass\ErrorBase.js 。也可以用 process.global.errorClassPath 
```javascript
const Error = require(process.global.errorClassPath);
throw new Error(Error.CODE.UNEXPECTED);
```