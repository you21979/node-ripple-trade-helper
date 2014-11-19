var RTH = require('..');
var Constant = RTH.Constant;

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
var bot01 = config['bot01'];


var rtj = RTH.createPrivateApi(bot01.address, bot01.secret, Constant.ISSUER.RIPPLE_TRADE_JAPAN);
rtj.balance().then(console.log);
//rtj.sell("XRP_JPY", 10, 0.777).then(console.log);
//rtj.cancelOrder(id).then(console.log);
//rtj.withdraw('address', 1, 'XRP').then(console.log);

