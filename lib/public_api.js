var ripplePromise = require('./ripple_promise');
var rippleutil = require('./ripple_util');

var Api = module.exports= function(issuer){
    this.issuer = issuer;
}
Api.prototype.depth = function(pair){
    var remote = ripplePromise.createRemote();
    return depth(remote, pair, this.issuer)
}

var depth = function(remote , pair, issuer ){
    var w = pair.toUpperCase().split('_').map(function(v){
        if(v === 'XRP') return {currency:v}
        else return {currency:v, issuer:issuer}
    })
    return ripplePromise.bookOffers(remote, w[0], w[1])
}

Api.prototype.accountBalance = function( address ){
    var remote = ripplePromise.createRemote();
    return ripplePromise.accountBalance( remote, address );
}
Api.prototype.accountLines = function( address ){
    var remote = ripplePromise.createRemote();
    return ripplePromise.accountLines( remote, address );
}
Api.prototype.accountOffers = function( address ){
    var remote = ripplePromise.createRemote();
    return ripplePromise.accountOffers(
        remote,
        address
    ).then(function(res){
        return res.offers.map(function(v){
            var buy = rippleutil.convertFromOffer(v.taker_pays);
            var sell = rippleutil.convertFromOffer(v.taker_gets);
            return {
                id:v.seq,
                pair:[buy.currency, sell.currency].join('_'),
                value:[buy,sell],
                flags:v.flags,
            }
        })
    })
}
