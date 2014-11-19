var util = require('util');
var rippleutil = require('./ripple_util');
var ripplePromise = require('./ripple_promise');
var PublicApi = require('./public_api');
var Constant = require('./constant');

var createPrivateApi = module.exports = function(myaddress, secret, issuer){
    return new Api(issuer, myaddress, secret);
}

var Api = function(issuer, address, secret){
    PublicApi.call(issuer);
    this.address = address;
    this.secret = secret;
}
util.inherits(Api, PublicApi);

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
    return ripplePromise.txOfferCance(
        remote,
        this.address,
        id
    )
}
Api.prototype.activeOrders = function(pair){
    var w = pair.split('_');
    return this.accountOffers(this.address).then(function(res){
        return res.filter(function(v){
            if(pair === v.pair) return true;
            else {
                var p = v.pair.split('_');
                return p[0] === 'XRP' ? p[1] === w[0] : p[0] === w[1];
            }
        }).map(function(v){
            var buy = v.value[0];
            var sell = v.value[1];
            var price = 0;
            var amount = 0;
            var issuer = '';
            var type = '';
            if(buy.currency === 'XRP'){
                amount = sell.value;
                price = buy.value / sell.value;
                issuer = sell.issuer;
            }else{
                price = sell.value / buy.value;
                amount = buy.value;
                issuer = buy.issuer;
            }

            if(pair === v.pair){
                type = 'buy';
            } else {
                type = 'sell';
            }
            return {
                id : v.id,
                pair : pair,
                type : type,
                amount : amount,
                price : price,
                issuer : issuer,
                flags : v.flags,
            }
        })
    });
}
Api.prototype.withdraw = function(dest_address, amount, currency, issuer){
    var remote = ripplePromise.createRemote();
    remote.set_secret(this.address, this.secret);
    return ripplePromise.txPayment(
        remote,
        this.address,
        dest_address,
        rippleutil.createAmount(amount, currency, issuer)
    )
}
Api.prototype.balance = function(){
    var remote = ripplePromise.createRemote();
    remote.set_secret(this.address, this.secret);
    return ripplePromise.balance(
        remote,
        this.address
    )
}
