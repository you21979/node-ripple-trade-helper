var util = require('util');
var RippleUtil = require('./ripple_util');
var RipplePromise = require('./ripple_promise');
var PublicApi = require('./public_api');
var Constant = require('./constant');

var createPrivateApi = module.exports = function(myaddress, secret, issuer){
    return new PrivateApi(issuer, myaddress, secret);
}

var mapActiveOrders = function(pair){
    return function(v){
        var buy = v.value[0];
        var sell = v.value[1];
        var price = 0;
        var amount = 0;
        var issuer = '';
        var type = '';
        if(buy.currency === 'XRP'){
            issuer = sell.issuer;
        }else{
            issuer = buy.issuer;
        }
        if(pair === v.pair){
            type = 'buy';
            price = sell.value / buy.value;
            amount = buy.value;
        } else {
            type = 'sell';
            price = buy.value / sell.value;
            amount = sell.value;
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
    }
}

var PrivateApi = function(issuer, address, secret){
    PublicApi.call(this, issuer);
    this.address = address;
    this.secret = secret;
}
util.inherits(PrivateApi, PublicApi);

PrivateApi.prototype.buy = function(pair, price, amount){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        remote.set_secret(self.address, self.secret);
        var w = RippleUtil.convertOfferCreateBid(pair, self.issuer, price, amount);
        return RipplePromise.txOfferCreate(
            remote,
            self.address,
            w.buy,
            w.sell,
            w.flag
        ).then(function(res){
            return {
                fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
                id : res.tx_json.Sequence,
            }
        })
    })
}
PrivateApi.prototype.sell = function(pair, price, amount){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        remote.set_secret(self.address, self.secret);
        var w = RippleUtil.convertOfferCreateAsk(pair, self.issuer, price, amount);
        return RipplePromise.txOfferCreate(
            remote,
            self.address,
            w.buy,
            w.sell,
            w.flag
        ).then(function(res){
            return {
                fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
                id : res.tx_json.Sequence,
            }
        })
    })
}
PrivateApi.prototype.cancelOrder = function(id){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        remote.set_secret(self.address, self.secret);
        return RipplePromise.txOfferCancel(
            remote,
            self.address,
            id
        ).then(function(res){
            return {
                fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
                id : res.tx_json.Sequence,
            }
        })
    })
}
PrivateApi.prototype.activeOrders = function(pair){
    var w = pair.split('_');
    return this.accountOffers(this.address).then(function(res){
        return res.filter(function(v){
            if(pair === v.pair) return true;
            else {
                var p = v.pair.split('_');
                return p[0] === 'XRP' ? p[1] === w[0] : p[0] === w[1];
            }
        }).map(mapActiveOrders(pair))
    });
}

PrivateApi.prototype.withdraw = function(dest_address, amount, currency){
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        remote.set_secret(self.address, self.secret);
        return RipplePromise.txPayment(
            remote,
            self.address,
            dest_address,
            RippleUtil.convertOffer(currency, amount, self.issuer)
        )
    });
}
PrivateApi.prototype.balance = function(){
    var funds = [];
    var self = this;
    return this.accountLines(this.address).then(function(res){
        var iou = res.lines.filter(function(v){return v.account === self.issuer}).map(function(v){
            var r = {};
            r[v.currency] = parseFloat(v.balance)
            return r;
        })
        funds = funds.concat(iou);
    }).then(function(){
        return self.accountBalance(self.address).then(function(res){
            var xrp = RippleUtil.convertOfferPriceTaker(res.node.Balance);
            funds.push({XRP:xrp.value});
            return {
                ledger : res.ledger_current_index,
                seq : res.node.Sequence,
                funds : funds,
            }
        })
    })
}

PrivateApi.prototype.trust = function(currency, limit){
    if(!limit) limit = 10000000;
    var self = this;
    return RipplePromise.defaultPromiseConnect(function(remote){
        remote.set_secret(self.address, self.secret);
        return RipplePromise.txTrustSet(
            remote,
            self.address,
            RippleUtil.convertOffer(currency, limit, self.issuer)
        )
    });
}
