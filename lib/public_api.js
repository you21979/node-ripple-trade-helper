var Promise = require('bluebird');
var Remote = require('ripple-lib').Remote;
var RippleUtil = require('./ripple_util');
var RipplePromise = require('./ripple_promise');
var util = require('util');

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

var PublicApi = module.exports = function(issuer){
    this.issuer = issuer;
}
PublicApi.prototype.orderBook = function(pair){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        return simpleOrderBook(remote, pair, self.issuer);
    })
}
PublicApi.prototype.accountBalance = function( address ){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.accountBalance( remote, address );
    })
}
PublicApi.prototype.accountLines = function( address ){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.accountLines( remote, address );
    })
}
PublicApi.prototype.accountOffers = function( address ){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return simpleAccountOffers( remote, address )
    })
}
PublicApi.prototype.promise = function(){
    return Promise;
}

