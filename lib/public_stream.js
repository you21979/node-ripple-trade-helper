var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var Promise = RipplePromise.promise();
var RippleSP = require('./ripple_specialization');

var PublicStream = module.exports = function(issuer){
    this.issuer = issuer;
    this.remote = RipplePromise.createRandomRemote();
    this.orderbook_quantize_digit = 5;
}

PublicStream.prototype.connect = function(){
    var TIMEOUT_SEC = 10 * 1000;
    var self = this;
    return new Promise(function(resolve, reject){
        var to = setTimeout(function(){
            self.disconnect();
            reject(new Error('timeout'));
        }, TIMEOUT_SEC);
        self.remote.connect(function(){
            clearTimeout(to);
            resolve();
        })
    });
}
PublicStream.prototype.disconnect = function(){
    // dirty hack
    this.remote._servers.forEach(function(server){server._shouldConnect = false})
    this.remote.disconnect()
}

PublicStream.prototype.orderBook = function(pair, isRaw){
    var p = RippleSP.simpleOrderBook(this.remote, pair, this.issuer);
    if(isRaw) return p;
    else return p.then(RippleSP.thenQuantizeOrderBook(this.orderbook_quantize_digit))
}
PublicStream.prototype.ping = function(){
    return RipplePromise.ping( this.remote )
}
PublicStream.prototype.serverInfo = function(){
    return RipplePromise.serverInfo( this.remote )
}
PublicStream.prototype.accountBalance = function( address ){
    return RipplePromise.accountBalance( this.remote, address );
}
PublicStream.prototype.accountLines = function( address ){
    return RipplePromise.accountLines( this.remote, address ).then(RippleSP.thenAccountLineNext(this.remote, []))
}
PublicStream.prototype.accountOffers = function( address ){
    return RippleSP.simpleAccountOffers( this.remote, address )
}
PublicStream.prototype.accountTransactions = function( address, params ){
    return RipplePromise.accountTransactions( this.remote, address, params )
}
PublicStream.prototype.transaction = function(tx){
    var self = this;
    if(!(tx instanceof Array)){ tx = [tx]; }
    return Promise.all(tx.map(function(v){ return RipplePromise.transaction( self.remote, v ) }))
}
PublicStream.prototype.transactionEntry = function(tx, ledger){
    return RipplePromise.transactionEntry( this.remote, tx, ledger )
}
PublicStream.prototype.transactionHistory = function(start){
    return RipplePromise.transactionHistory( this.remote, start )
}
PublicStream.prototype.feeTxUnit = function(){
    return Promise.resolve(RippleUtil.XRPtoNumber(this.remote.feeTxUnit()));
}
PublicStream.prototype.promise = function(){
    return Promise;
}

PublicStream.prototype.ledger = function(options){
    return RipplePromise.ledger(this.remote, options);
}
PublicStream.prototype.ledgerClosed = function(){
    return RipplePromise.ledgerClosed(this.remote);
}
PublicStream.prototype.ledgerHeader = function(){
    return RipplePromise.ledgerHeader(this.remote);
}
PublicStream.prototype.ledgerCurrent = function(){
    return RipplePromise.ledgerCurrent(this.remote);
}

