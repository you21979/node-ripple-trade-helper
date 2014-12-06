var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var PublicApi = require('./public_api');
var PrivateStream = require('./private_stream')

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

var PrivateApi = module.exports = function(issuer, address, secret){
    PublicApi.call(this, issuer);
    this.address = address;
    this.secret = secret;
}
util.inherits(PrivateApi, PublicApi);

PrivateApi.prototype.buy = function(pair, price, amount){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.buy(pair, price, amount)
    })
}
PrivateApi.prototype.sell = function(pair, price, amount){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.sell(pair, price, amount)
    })
}
PrivateApi.prototype.cancelOrder = function(id){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.cancelOrder(id)
    })
}
PrivateApi.prototype.activeOrders = function(pair){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.activeOrders(pair)
    })
}

PrivateApi.prototype.withdraw = function(dest_address, amount, currency, dest_tag){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.withdraw(dest_address, amount, currency, dest_tag)
    })
}
PrivateApi.prototype.balance = function(){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.balance()
    })
}

PrivateApi.prototype.trust = function(currency, limit){
    return flow(new PrivateStream(this.issuer, this.address, this.secret), function(stream){
        return stream.trust(currency, limit)
    })
}

PrivateApi.prototype.deposit = function(){
    return this.promise().resolve(this.address);
}

