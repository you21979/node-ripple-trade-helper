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

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.orderBook(pair).then(function(res){
    return [res.asks.splice(0, 10).map(function(v){return {
        price : v[0],
        amount : RTH.util.adjustValueFloor(v[1], 8),
    }}).reverse(),
    res.bids.splice(0, 10).map(function(v){return {
        price : v[0],
        amount : RTH.util.adjustValueFloor(v[1], 8),
    }})
    ]
}).then(function(res){
    var fill = function(data, max){
        var n = max - data.toString().length;
        var w = [];
        for(var i = 0; i<n; ++i) w.push(' ');
        return data.toString() + w.join('');
    }
    var left = 20;
    var center = 15;
    console.log("%s",
        res[0].reduce(function(r,v){ r.push(fill(v.amount, left)+ "|" + fill("  " + v.price.toString(), center) +"|"); return r}, []).join('\n')
    )
    console.log("---------------------------------------------------")
    console.log("%s",
        res[1].reduce(function(r,v){ r.push(fill('', left)+ "|" + fill("  " + v.price.toString(), center) + "|" + "  "+ v.amount); return r}, []).join('\n')
    )
})

