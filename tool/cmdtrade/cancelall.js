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

var api = RTH.createPrivateStream(exchange.address, exchange.secret, exchange.issuer);
api.connect().then(function(){
    return api.activeOrders(pair).then(function(res){
        return RTH.promise().all(res.map(function(v){return api.cancelOrder(v.id)})).then(console.log)
    })
}).then(function(){ return api.disconnect()})

