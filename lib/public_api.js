var RipplePromise = require('ripple-lib-promise');
var Promise = RipplePromise.promise();
var PublicStream = require('./public_stream')

var flow = function(stream, f){
    return stream.connect().then(function(){
        return f(stream)
    }).then(function(res){
        stream.disconnect();
        return res;
    }).catch(function(err){
        stream.disconnect();
        throw err;
    })
}

var PublicApi = module.exports = function(issuer){
    this.issuer = issuer;
}
PublicApi.prototype.orderBook = function(pair, isRaw){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.orderBook(pair, isRaw)
    })
}
PublicApi.prototype.ping = function(){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.ping()
    })
}
PublicApi.prototype.serverInfo = function(){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.serverInfo()
    })
}
PublicApi.prototype.accountBalance = function( address ){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.accountBalance(address)
    })
}
PublicApi.prototype.accountLines = function( address ){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.accountLines(address)
    })
}
PublicApi.prototype.accountOffers = function( address ){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.accountOffers(address)
    })
}
PublicApi.prototype.accountTransactions = function( address, params ){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.accountTransactions(address, params)
    })
}
PublicApi.prototype.transaction = function(tx){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.transaction(tx)
    })
}
PublicApi.prototype.transactionEntry = function(tx, ledger){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.transactionEntry(tx, ledger)
    })
}
PublicApi.prototype.transactionHistory = function(start){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.transactionHistory(start)
    })
}
PublicApi.prototype.feeTxUnit = function(){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.feeTxUnit()
    })
}

PublicApi.prototype.ledger = function(options){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.ledger(options)
    })
}
PublicApi.prototype.ledgerClosed = function(){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.ledgerClosed()
    })
}
PublicApi.prototype.ledgerHeader = function(){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.ledgerHeader()
    })
}
PublicApi.prototype.ledgerCurrent = function(){
    return flow(new PublicStream(this.issuer), function(stream){
        return stream.ledgerCurrent()
    })
}

PublicApi.prototype.promise = function(){
    return Promise;
}

