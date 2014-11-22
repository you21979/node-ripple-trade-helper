var RTH = require('..');
var Constant = RTH.Constant;

var watchlist = [
    Constant.ISSUER.RIPPLE_TRADE_JAPAN,
    Constant.ISSUER.RIPPLE_MARKET_JAPAN,
    Constant.ISSUER.TOKYOJPY
];

var Promise = require('bluebird');
var fee = 0.001;

Promise.all(watchlist.map(function(v){ return RTH.createPublicApi(v).orderBook('XRP_JPY') })).then(function(res){
    var bids = [];
    var asks = [];
    res.forEach(function(v){
        bids.push(v.bids.shift())
        asks.push(v.asks.shift())
    })
    var w = asks.map(function(v){
        return bids.map(function(w){
            var state = w[0] > (v[0]+fee);
            return {
                state : state,
                bid : w,
                ask : v
            }
        }).filter(function(v){return v.state})
    })
    w.forEach(function(w){
        w.forEach(function(v){
            console.log(v)
        })
    })
})
