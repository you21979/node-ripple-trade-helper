#!/usr/bin/env node
var RTH = require('../..');
var Constant = RTH.Constant;

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 2){
    console.log("%s exchange pair", process.argv[1])
    console.log(" exchange = wallet name");
    console.log(" pair = btc_xrp, xrp_jpy or otherpair");
    return;
}

var exchange = config[opt.shift()];
var pair = opt.shift();

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.orderBook(pair).then(function(res){
    console.log('asks\n',res.asks.splice(0, 10).map(function(v){return {
        price : v[0],
        amount : v[1],
    }}).reverse())
    console.log('bids\n', res.bids.splice(0, 10).map(function(v){return {
        price : v[0],
        amount : v[1],
    }}))
})

