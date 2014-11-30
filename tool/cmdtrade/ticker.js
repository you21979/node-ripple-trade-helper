#!/usr/bin/env node
var RTH = require('../..');

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

var adjustPriceBid = function(price){ return RTH.util.adjustValueFloor(price, 4) }
var adjustPriceAsk = function(price){ return RTH.util.adjustValueCeil(price, 4) }
var adjustAmount = function(amount){ return dropdigit(amount, 4) }
var randomAmount = function(min, max){ return adjustAmount(min + (Math.random() * (max - min))) }

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.orderBook(pair).then(function(res){
    var ask = res.asks.splice(0, 1).map(function(v){return v[0]}).shift();
    var bid = res.bids.splice(0, 1).map(function(v){return v[0]}).shift();
    console.log("%s : %d - %d", pair, adjustPriceBid(bid), adjustPriceAsk(ask))
})

