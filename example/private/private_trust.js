var RTH = require('../..');
var Constant = require('../constant');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
var bot01 = config['bot01'];

var rtj = RTH.createPrivateApi(bot01.address, bot01.secret, Constant.ISSUER.RIPPLE_TRADE_JAPAN);
rtj.trust('JPY').then(console.log);

