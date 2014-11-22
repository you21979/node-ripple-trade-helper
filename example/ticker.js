var RTH = require('..');
var Constant = RTH.Constant;

var watchlist = [
    Constant.ISSUER.RIPPLE_TRADE_JAPAN,
    Constant.ISSUER.RIPPLE_MARKET_JAPAN,
    Constant.ISSUER.TOKYOJPY
];

var Promise = require('bluebird');
var fee = 0.001;

var p = function(v){
    return Math.floor(v * 10000) / 10000
}

Promise.all(watchlist.map(function(v){ return RTH.createPublicApi(v).orderBook('XRP_JPY') })).then(function(res){
    res.forEach(function(v){
        console.log(p(v.bids.shift()[0]), p(v.asks.shift()[0]))
    })
})
