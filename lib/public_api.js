var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var Promise = RipplePromise.promise();
var RippleSP = require('./ripple_specialization');

var PublicApi = module.exports = function(issuer){
    this.issuer = issuer;
    this.orderbook_quantize_digit = 3;
}
PublicApi.prototype.orderBook = function(pair, isRaw){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        var p = RippleSP.simpleOrderBook(remote, pair, self.issuer);
        if(isRaw) return p;
        else return p.then(RippleSP.thenQuantizeOrderBook(self.orderbook_quantize_digit))
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
        return RipplePromise.accountLines( remote, address ).then(RippleSP.thenAccountLineNext(remote, []))
    })
}
PublicApi.prototype.accountOffers = function( address ){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RippleSP.simpleAccountOffers( remote, address )
    })
}
PublicApi.prototype.accountTransactions = function( address, params ){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return  RipplePromise.accountTransactions( remote, address, params )
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
PublicApi.prototype.transactionHistory = function(start){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.transactionHistory( remote, start )
    })
}
PublicApi.prototype.feeTxUnit = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RippleUtil.XRPtoNumber(remote.feeTxUnit());
    })
}
PublicApi.prototype.promise = function(){
    return Promise;
}

PublicApi.prototype.ledger = function(options){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.ledger(remote, options);
    })
}
PublicApi.prototype.ledgerClosed = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.ledgerClosed(remote);
    })
}
PublicApi.prototype.ledgerHeader = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.ledgerHeader(remote);
    })
}
PublicApi.prototype.ledgerCurrent = function(){
    return RipplePromise.defaultPromiseConnect(function(remote){
        return RipplePromise.ledgerCurrent(remote);
    })
}

