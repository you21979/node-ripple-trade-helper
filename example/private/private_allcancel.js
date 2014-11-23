var RTH = require('../..');
var Constant = RTH.Constant;

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
var bot01 = config['bot01'];


var rtj = RTH.createPrivateApi(bot01.address, bot01.secret, '');
rtj.activeOrders('XRP_JPY').then(function(res){
    return rtj.promise().all(res.map(function(v){return rtj.cancelOrder(v.id); }))
}).then(console.log);

