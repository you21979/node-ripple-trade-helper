var util = require('util');
var rp = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var RippleSP = require('./ripple_specialization');
var Promise = require('bluebird');

var PublicStream = module.exports = function(issuer){
    this.issuer = issuer;
    this.remote = null;
    this.orderbook_quantize_digit = 5;
}

PublicStream.prototype.connect = function(){
    var self = this;
    return rp.createConnect().then(function(remote){
        self.remote = remote;
    })
}
PublicStream.prototype.disconnect = function(){
    if(this.remote) this.remote.disconnect()
}

PublicStream.prototype.orderBook = function(pair, isRaw){
    var p = RippleSP.simpleOrderBook(this.remote, pair, this.issuer);
    if(isRaw) return p;
    else return p.then(RippleSP.thenQuantizeOrderBook(this.orderbook_quantize_digit))
}
PublicStream.prototype.ping = function(){
    return rp.req.ping( this.remote )
}
PublicStream.prototype.serverInfo = function(){
    return rp.req.serverInfo( this.remote )
}
PublicStream.prototype.accountBalance = function( address ){
    return rp.req.accountBalance( this.remote, address );
}
PublicStream.prototype.accountLines = function( address ){
    return rp.req.accountLines( this.remote, address ).then(RippleSP.thenAccountLineNext(this.remote, []))
}
PublicStream.prototype.accountOffers = function( address ){
    return RippleSP.simpleAccountOffers( this.remote, address )
}
PublicStream.prototype.accountTransactions = function( address, params ){
    return rp.req.accountTransactions( this.remote, address, params )
}
PublicStream.prototype.transaction = function(tx){
    var self = this;
    if(!(tx instanceof Array)){ tx = [tx]; }
    return Promise.all(tx.map(function(v){ return rp.req.transaction( self.remote, v ) }))
}
PublicStream.prototype.transactionEntry = function(tx, ledger){
    return rp.req.transactionEntry( this.remote, tx, ledger )
}
PublicStream.prototype.transactionHistory = function(start){
    return rp.req.transactionHistory( this.remote, start )
}
PublicStream.prototype.feeTxUnit = function(){
    return Promise.resolve(RippleUtil.XRPtoNumber(this.remote.feeTxUnit()));
}
PublicStream.prototype.promise = function(){
    return Promise;
}

PublicStream.prototype.ledger = function(options){
    return rp.req.ledger(this.remote, options);
}
PublicStream.prototype.ledgerClosed = function(){
    return rp.req.ledgerClosed(this.remote);
}
PublicStream.prototype.ledgerHeader = function(){
    return rp.req.ledgerHeader(this.remote);
}
PublicStream.prototype.ledgerCurrent = function(){
    return rp.req.ledgerCurrent(this.remote);
}

