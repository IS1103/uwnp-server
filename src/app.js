
const app = new (require('./system/main'));

//設定檔
app.configure('server', { port: process.env['SERVICE_PORT'] });

//插件
// const channel = new (require('./plugins/Channel'));
const event = new (require('events').EventEmitter);
// app.set("channel", channel);
app.set("event", event);

//安裝中間件
// const decodePack = new (require('./system/middleware/pack/DecodePack'));
// const packageGateway = new (require('./system/middleware/PackageGateway'))(app);
// const encodePack = new (require('./system/middleware/pack/EncodePack'));

// app.use(decodePack.next.bind(packageGateway));      //解碼資料
// app.use(packageGateway.next.bind(packageGateway));  //轉發資料
// app.use(encodePack.next.bind(packageGateway));      //打包資料

//啟動伺服器
app.start();