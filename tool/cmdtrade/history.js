#!/usr/bin/env node
var RTH = require('../..');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 1){
    console.log("%s exchange orderid", process.argv[1])
    console.log(" exchange = wallet name");
    console.log(" orderid = number");
    return;
}

var exchange = config[opt.shift()];

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.history().then(console.log).catch(console.log);

