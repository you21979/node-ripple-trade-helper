var RTH = require('..');
var Constant = RTH.Constant;

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
var bot01 = config['bot01'];


var rtj = RTH.createPrivateApi(bot01.address, bot01.secret, Constant.ISSUER.RIPPLE_TRADE_JAPAN);
var price = 0.5;
var amount = 10;
rtj.buy("XRP_JPY", price, amount).then(function(res){
    console.log(res)
    return rtj.activeOrders('XRP_JPY').then(console.log);
})
//rtj.cancelOrder(id).then(console.log);

