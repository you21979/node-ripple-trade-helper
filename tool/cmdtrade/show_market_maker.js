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
api.orderBook(pair, true).then(function(res){
    var askmaker = res.asks.map(function(v){ return v[2] }).reduce(function(r,v){
        if(!(v in r)) r[v] = 0;
        r[v]++;
        return r;
    }, {});
    var bidmaker = res.bids.map(function(v){ return v[2] }).reduce(function(r,v){
        if(!(v in r)) r[v] = 0;
        r[v]++;
        return r;
    }, {});
    var sorter = function(ra, rb){
        return function(a, b){
            if( a[1] < b[1] ) return ra;
            if( a[1] > b[1] ) return rb;
            return 0;
        }
    }
    var ask = Object.keys(askmaker).
        map(function(k){return [k, askmaker[k]] }).
        filter(function(v){return v[1] > 1}).
        sort(sorter(1,-1))
    var bid = Object.keys(askmaker).
        map(function(k){return [k, bidmaker[k]] }).
        filter(function(v){return v[1] > 1}).
        sort(sorter(1,-1))
    console.log(ask.slice(0, 5), bid.slice(0, 5))
})
