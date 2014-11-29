#!/usr/bin/env node
var RTH = require('../..');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 4){
    console.log("%s exchange address amount currency", process.argv[1])
    console.log(" exchange = wallet name");
    console.log(" address = payment address");
    console.log(" amount = number");
    console.log(" currency = xrp, btc, jpy or other");
    return;
}

var exchange = config[opt.shift()];
var address = opt.shift();
var amount = opt.shift();
var currency = opt.shift();

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.withdraw(address, amount, currency).then(console.log).catch(console.log);

