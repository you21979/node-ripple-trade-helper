var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var Promise = RipplePromise.promise();

var simpleOrderBook = exports.simpleOrderBook = function(remote, pair, issuer){
    return Promise.all([
        RipplePromise.orderBook(remote, RippleUtil.convertOrderBookBid(pair, issuer)),
        RipplePromise.orderBook(remote, RippleUtil.convertOrderBookAsk(pair, issuer))
    ]).
    then(function(res){
        var tbl = RippleUtil.convertOrderBookPriceTaker(pair)
        return {
            bids : res[0].map(function(v){
                return [tbl.bid_price(v), tbl.bid_amount(v), v.Account, v.Flags]
            }).filter(function(v){return v[1] > 0}),
            asks : res[1].map(function(v){
                return [tbl.ask_price(v), tbl.ask_amount(v), v.Account, v.Flags]
            }).filter(function(v){return v[1] > 0}),
        }
    })
}
var simpleAccountOffers = exports.simpleAccountOffers = function(remote, address){
    return RipplePromise.accountOffers(
        remote,
        address
    ).then(function(res){
        return res.offers.map(function(v){
            var buy = RippleUtil.convertOfferPriceTaker(v.taker_pays);
            var sell = RippleUtil.convertOfferPriceTaker(v.taker_gets);
            return {
                id:v.seq,
                pair:[buy.currency, sell.currency].join('_'),
                value:[buy,sell],
                flags:v.flags,
            }
        })
    })
}

var thenQuantizeOrderBook = exports.thenQuantizeOrderBook = function(pricedigit){
    var adjustAsk = function(price){
        return RippleUtil.adjustValueCeil(price, pricedigit - RippleUtil.numberOfDigits(price))
    }
    var adjustBid = function(price){
        return RippleUtil.adjustValueFloor(price, pricedigit - RippleUtil.numberOfDigits(price))
    }
    var reducer = function(quantizeFunc){
        return function(r, v){
            var k = quantizeFunc(v[0]);
            if(!(k in r)) r[k] = 0;
            r[k] += v[1];
            return r;
        }
    }
    var sorter = function(ra, rb){
        return function(a, b){
            if( a[0] < b[0] ) return ra;
            if( a[0] > b[0] ) return rb;
            return 0;
        }
    }
    var quantizeAsk = function(asks){
        var w = asks.reduce(reducer(adjustAsk), {});
        return Object.keys(w).map(function(k){ return [parseFloat(k), w[k]] }).sort(sorter(-1, 1))
    }
    var quantizeBid = function(bids){
        var w = bids.reduce(reducer(adjustBid), {});
        return Object.keys(w).map(function(k){ return [parseFloat(k), w[k]] }).sort(sorter(1, -1))
    }
    return function(res){
        return {
            asks : quantizeAsk(res.asks),
            bids : quantizeBid(res.bids),
        }
    }
}

var thenAccountLineNext = exports.thenAccountLineNext = function(remote, list){
    return function(res){
        list.push(res);
        var ledger = res.ledger_current_index || res.ledger_index;
        if( res.marker === undefined ){
            return list.reduce(function(r,v){
                return r.concat(v.lines)
            }, []);
        }
        return RipplePromise.accountLines( remote, res.account, {
            ledger:ledger,
            marker:res.marker,
        }).then(thenAccountLineNext(remote, list));
    }
}

