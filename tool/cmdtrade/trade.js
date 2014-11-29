var RTH = require('../..');
var Constant = RTH.Constant;

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 5){
    return console.log("%s exchange pair type price amount", process.argv[1])
}

var exchange = config[opt.shift()];
var pair = opt.shift();
var type = opt.shift();
var price = parseFloat(opt.shift());
var amount = parseFloat(opt.shift());

var rtj = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
switch(type){
case "buy":
    rtj.buy(pair, price, amount).then(console.log);
    break;
case "sell":
    rtj.sell(pair, price, amount).then(console.log);
    break;
}

