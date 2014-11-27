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

