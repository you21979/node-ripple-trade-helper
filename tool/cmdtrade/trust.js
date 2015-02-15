#!/usr/bin/env node
var RTH = require('../..');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 2){
    console.log("%s exchange IOU", process.argv[1])
    console.log(" exchange = wallet name");
    console.log(" trust IOU = IOU name");
    return;
}

var exchange = config[opt.shift()];
var currency = opt.shift();

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.trust(currency.toUpperCase(), 100000000000);

