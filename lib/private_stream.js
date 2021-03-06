var util = require('util');
var rp = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var PublicStream = require('./public_stream');
var RippleSP = require('./ripple_specialization');
var Promise = require('bluebird');

var timeconvert = function(datestr){
    return RippleUtil.rippleTimeToMoment(parseInt(datestr)).unix()
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

var PrivateStream = module.exports = function(issuer, address, secret){
    PublicStream.call(this, issuer);
    this.address = address;
    this.secret = secret;
}


util.inherits(PrivateStream, PublicStream);

PrivateStream.prototype.buy = function(pair, price, amount){
    var self = this;
    var w = RippleUtil.convertOfferCreateBid(pair, self.issuer, price, amount);
    return rp.tx.offerCreate(
        self.remote,
        self.secret,
        self.address,
        w.buy,
        w.sell,
        w.flag
    ).then(function(res){
        return {
            pair : pair,
            fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
            id : res.tx_json.Sequence,
            date : timeconvert(res.tx_json.date),
            hash : res.tx_json.hash,
            ledger: res.ledger_index,
            type : 'buy',
            price : price,
            amount : amount,
            issuer : self.issuer,
        }
    })
}
PrivateStream.prototype.sell = function(pair, price, amount){
    var self = this;
    var w = RippleUtil.convertOfferCreateAsk(pair, self.issuer, price, amount);
    return rp.tx.offerCreate(
        self.remote,
        self.address,
        w.buy,
        w.sell,
        w.flag
    ).then(function(res){
        return {
            pair : pair,
            fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
            id : res.tx_json.Sequence,
            date : timeconvert(res.tx_json.date),
            hash : res.tx_json.hash,
            ledger: res.ledger_index,
            type : 'sell',
            price : price,
            amount : amount,
            issuer : self.issuer,
        }
    })
}
PrivateStream.prototype.cancelOrder = function(id){
    var self = this;
    return rp.tx.offerCancel(
        self.remote,
        self.secret,
        self.address,
        id
    ).then(function(res){
        return {
            fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
            id : res.tx_json.Sequence,
            cancel_id : res.tx_json.OfferSequence,
            date : timeconvert(res.tx_json.date),
            hash : res.tx_json.hash,
            ledger: res.ledger_index,
            type : 'cancel',
            issuer : self.issuer,
        }
    })
}
PrivateStream.prototype.activeOrders = function(pair){
    pair = pair.toUpperCase();
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

PrivateStream.prototype.withdraw = function(dest_address, amount, currency, dest_tag){
    var self = this;
    return rp.tx.payment(
        self.remote,
        self.secret,
        self.address,
        dest_address,
        RippleUtil.convertOffer(currency.toUpperCase(), amount, self.issuer),
        dest_tag
    ).then(function(res){
        return {
            fee : RippleUtil.XRPtoNumber(res.tx_json.Fee),
            date : timeconvert(res.tx_json.date),
            hash : res.tx_json.hash,
            ledger: res.ledger_index,
            type : 'withdraw',
            destination : res.tx_json.Destination,
            amount : RippleUtil.convertOfferPriceTaker(res.tx_json.Amount),
        }
    })
}
PrivateStream.prototype.balance = function(){
    var self = this;
    return Promise.all([
        rp.req.accountLines( self.remote, self.address ),
        rp.req.accountBalance( self.remote, self.address )
    ]).spread(function(reslines,resbalance){
        var funds = reslines.lines.
                    filter(function(v){return v.account === self.issuer}).
                    reduce(function(r, v){
                        r[v.currency] = parseFloat(v.balance);
                        return r;
                    }, {})
        var xrp = RippleUtil.convertOfferPriceTaker(resbalance.node.Balance);
        funds['XRP'] = xrp.value;
        return {
            ledger : resbalance.ledger_current_index,
            seq : resbalance.node.Sequence,
            funds : funds,
        }
    })
}

PrivateStream.prototype.history = function(){
    return RippleSP.tradeHistory(this.remote, this.address);
}

PrivateStream.prototype.trust = function(currency, limit){
    if(limit === undefined) limit = 10000000;
    var self = this;
    return rp.req.accountLines(self.remote, self.address).then(function(res){
        var r = res.lines.filter(function(v){
            return v.account === self.issuer && v.currency === currency
        });
        if(r.length === 0){
            // new reg
            return rp.tx.trustSet(
                self.remote,
                self.secret,
                self.address,
                RippleUtil.convertOffer(currency, limit, self.issuer)
            ).then(function(res){
                return {status:'register'};
            })
        }else{
            // update
            if(r[0].limit === limit.toString()){
                return {status:'exist'};
            }
            return rp.tx.trustSet(
                self.remote,
                self.secret,
                self.address,
                RippleUtil.convertOffer(currency, limit, self.issuer)
            ).then(function(res){
                return {status:'update'};
            })
        }
    })
}

PrivateStream.prototype.deposit = function(){
    return this.promise().resolve(this.address);
}

