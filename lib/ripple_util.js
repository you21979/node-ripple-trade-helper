var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var Transaction = require('ripple-lib').Transaction;

var XRP_UNIT = Amount.bi_xns_unit.intValue();
var ORDER_BOOK_FLAGS = {
    tfPassive : 0x00010000,
    tfImmediateOrCancel : 0x00020000,
    tfFillOrKill : 0x00040000,
    tfSell : 0x00080000,
}

var XRPtoNumber = exports.XRPtoNumber = function(str){
    return parseFloat(str) / XRP_UNIT;
}

var convertOrderBookFlags = exports.convertOrderBookFlags = function(flags){
    return Object.keys(ORDER_BOOK_FLAGS).map(function(key){
        return {
            name:key,
            value:flags & ORDER_BOOK_FLAGS[key] ? true : false
        }
    })
}


var createRemote = exports.createRemote = function(){
    var remote = new Remote({
//         trace:   true,
         trusted:        true,
         local_signing:  true,
//   local_fee:      true,
//   fee_cushion:     1.5,
         servers: [{
            host: 's1.ripple.com'
            , port: 443
            , secure: true
         }]
    });
    return remote;
}

var convertOffer = exports.convertOffer = function(name, value, issuer){
    return (name === 'XRP') ? (value * XRP_UNIT).toString() :
                              {currency:name, issuer:issuer, value:value.toString()};
}

var convertOfferCreateBid = exports.convertOfferCreateBid = function(pair, issuer, price, amount){
    var w = pair.toUpperCase().split('_');
    return {
        buy : convertOffer(w[0], amount, issuer),
        sell : convertOffer(w[1],  amount * price, issuer),
        flag : 0,
    }
}
var convertOfferCreateAsk = exports.convertOfferCreateAsk = function(pair, issuer, price, amount){
    var w = pair.toUpperCase().split('_');
    return {
        buy : convertOffer(w[1], amount * price, issuer),
        sell : convertOffer(w[0], amount, issuer),
        flag : Transaction.flags.OfferCreate.Sell,
    }
}

var convertOrderBook = function(pair, issuer, pays, gets){
    var w = pair.toUpperCase().split('_').map(function(v){
        if(v === 'XRP') return {currency:v, issuer:'rrrrrrrrrrrrrrrrrrrrrhoLvTp'}
        else return {currency:v, issuer:issuer}
    })
    var r = {
        issuer_pays : w[pays].issuer,
        currency_pays : w[pays].currency,
        issuer_gets : w[gets].issuer,
        currency_gets : w[gets].currency,
    }
    return r;
}

var convertOrderBookBid = exports.convertOrderBookBid = function(pair, issuer){
    var pays = 0;//buy
    var gets = 1;//sell
    return convertOrderBook(pair, issuer, pays, gets);
}

var convertOrderBookAsk = exports.convertOrderBookAsk = function(pair, issuer){
    var pays = 1;//buy
    var gets = 0;//sell
    return convertOrderBook(pair, issuer, pays, gets);
}

var convertOrderBookPriceTaker = exports.convertOrderBookPriceTaker = function(pair){
    var w = pair.split('_');
    if(w[0] === 'XRP'){
        return {
            bid_amount : function(v){
                return parseFloat(v.taker_pays_funded) / XRP_UNIT;
            },
            bid_price : function(v){
                return 1 / (parseFloat(v.quality) / XRP_UNIT);
            },
            ask_amount : function(v){
                return parseFloat(v.taker_pays_funded);
            },
            ask_price : function(v){
                return parseFloat(v.quality) * XRP_UNIT;
            },
        }
    }else{
        return {
            bid_amount : function(v){
                return parseFloat(v.taker_pays_funded);
            },
            bid_price : function(v){
                return 1 / (parseFloat(v.quality) * XRP_UNIT);
            },
            ask_amount : function(v){
                return parseFloat(v.taker_pays_funded) / XRP_UNIT;
            },
            ask_price : function(v){
                return parseFloat(v.quality) / XRP_UNIT;
            },
        }
    }
}


var convertOfferPriceTaker = exports.convertOfferPriceTaker = function(data){
// あとで直す
    var currency = "XRP";
    var value = "";
    var issuer = "";
    if(data instanceof Object){
        currency = data.currency;
        value = parseFloat(data.value);
        issuer = data.issuer;
    }else{
        value = parseFloat(data) / XRP_UNIT;
    }
    return {
        currency : currency,
        issuer : issuer,
        value : value,
    }
}


