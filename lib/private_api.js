var rippleutil = require('./ripple_util');
var ripplePromise = require('./ripple_promise');
var Constant = require('./constant');

var createPrivateApi = module.exports = function(myaddress, secret, issuer){
    return new Api(issuer, myaddress, secret);
}

var Api = function(issuer, address, secret){
    this.issuer = issuer;
    this.address = address;
    this.secret = secret;
}
Api.prototype.buy = function(pair, amount, price){
    var remote = ripplePromise.createRemote();
    remote.set_secret(this.address, this.secret);
    var w = rippleutil.convertCurrencyPairBid(pair, this.issuer, amount, price);
    return ripplePromise.trade(
        remote,
        this.address,
        w.buy,
        w.sell
    ).then(function(res){
        return {
            id : res.tx_json.Sequence,
        }
    })
}
Api.prototype.sell = function(pair, amount, price){
    var remote = ripplePromise.createRemote();
    remote.set_secret(this.address, this.secret);
    var w = rippleutil.convertCurrencyPairAsk(pair, this.issuer, amount, price);
    return ripplePromise.trade(
        remote,
        this.address,
        w.buy,
        w.sell
    ).then(function(res){
        return {
            id : res.tx_json.Sequence,
        }
    })
}
Api.prototype.cancelOrder = function(id){
    var remote = ripplePromise.createRemote();
    remote.set_secret(this.address, this.secret);
    return ripplePromise.cancelOrder(
        remote,
        this.address,
        id
    )
}
Api.prototype.withdraw = function(dest_address, amount, currency, issuer){
    var remote = ripplePromise.createRemote();
    remote.set_secret(this.address, this.secret);
    return ripplePromise.withdraw(
        remote,
        this.address,
        dest_address,
        rippleutil.createAmount(amount, currency, issuer)
    )
}
