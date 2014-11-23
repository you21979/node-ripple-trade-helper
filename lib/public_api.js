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

var PublicApi = module.exports = function(issuer){
    this.issuer = issuer;
}
PublicApi.prototype.orderBook = function(pair){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        return simpleOrderBook(remote, pair, self.issuer);
    })
}
PublicApi.prototype.ping = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.ping( remote )
    })
}
PublicApi.prototype.serverInfo = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.serverInfo( remote )
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
PublicApi.prototype.transaction = function(tx){
    if(!(tx instanceof Array)){ tx = [tx]; }
    return RipplePromise.defaultPromiseConnect(function(remote){
        return Promise.all(tx.map(function(v){ return RipplePromise.transaction( remote, v ) }))
    })
}
PublicApi.prototype.transactionEntry = function(tx, ledger){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.transactionEntry( remote, tx, ledger )
    })
}
PublicApi.prototype.feeTxUnit = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return remote.feeTxUnit();
    })
}
PublicApi.prototype.promise = function(){
    return Promise;
}

