var ripplePromise = require('./ripple_promise');

var createPublicApi = module.exports = function(issuer){
    return new Api(issuer);
}

var Api = function(issuer){
    this.issuer = issuer;
}
Api.prototype.depth = function(pair){
    return depthXrp(pair, this.issuer)
}

var depthXrp = function( pair, issuer ){
    var w = pair.toUpperCase().split('_').map(function(v){
        if(v === 'XRP') return {currency:v}
        else return {currency:v, issuer:issuer}
    })
    return ripplePromise.bookOffers(w[1], w[0])
}

