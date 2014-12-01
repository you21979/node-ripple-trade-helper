var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var Promise = RipplePromise.promise();
var RippleSP = require('./ripple_specialization');

var PublicApi = module.exports = function(issuer, callbacks){
    this.issuer = issuer;
    this.remote = RipplePromise.createRandomRemote();
    if(callbacks && callbacks.disconnect){
        this.remote.on('disconnect', function(){
            callbacks.disconnect();
        })
    }
    if(callbacks && callbacks.connect){
        this.remote.on('connect', function(){
            callbacks.connect();
        })
    }
    this.connect()
}

PublicApi.prototype.connect = function(){
    this.remote.connect()
}
PublicApi.prototype.disconnect = function(){
    this.remote.disconnect()
}


PublicApi.prototype.orderBook = function(pair){
    return RippleSP.simpleOrderBook(this.remote, pair, this.issuer);
}
PublicApi.prototype.ping = function(){
    return RipplePromise.ping( this.remote )
}
PublicApi.prototype.serverInfo = function(){
    return RipplePromise.serverInfo( this.remote )
}
PublicApi.prototype.accountBalance = function( address ){
    return RipplePromise.accountBalance( this.remote, address );
}
PublicApi.prototype.accountLines = function( address ){
    return RipplePromise.accountLines( this.remote, address );
}
PublicApi.prototype.accountOffers = function( address ){
    return RippleSP.simpleAccountOffers( this.remote, address )
}
PublicApi.prototype.accountTransactions = function( address, params ){
    return RipplePromise.accountTransactions( this.remote, address, params )
}
PublicApi.prototype.transaction = function(tx){
    var self = this;
    if(!(tx instanceof Array)){ tx = [tx]; }
    return Promise.all(tx.map(function(v){ return RipplePromise.transaction( self.remote, v ) }))
}
PublicApi.prototype.transactionEntry = function(tx, ledger){
    return RipplePromise.transactionEntry( this.remote, tx, ledger )
}
PublicApi.prototype.transactionHistory = function(start){
    return RipplePromise.transactionHistory( this.remote, start )
}
PublicApi.prototype.feeTxUnit = function(){
    return RippleUtil.XRPtoNumber(this.remote.feeTxUnit());
}
PublicApi.prototype.promise = function(){
    return Promise;
}

PublicApi.prototype.ledger = function(options){
    return RipplePromise.ledger(this.remote, options);
}
PublicApi.prototype.ledgerClosed = function(){
    return RipplePromise.ledgerClosed(this.remote);
}
PublicApi.prototype.ledgerHeader = function(){
    return RipplePromise.ledgerHeader(this.remote);
}
PublicApi.prototype.ledgerCurrent = function(){
    return RipplePromise.ledgerCurrent(this.remote);
}

