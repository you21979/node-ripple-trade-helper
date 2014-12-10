"use strict";
var assert = require('assert');
var ripplelib = require('ripple-lib');
var Amount = ripplelib.Amount;
var Transaction = ripplelib.Transaction;
var UInt160 = ripplelib.UInt160;

var XRP_UNIT = Amount.bi_xns_unit.intValue() * 1.0;
var ORDER_BOOK_FLAGS = {
    tfPassive : 0x00010000,
    tfImmediateOrCancel : 0x00020000,
    tfFillOrKill : 0x00040000,
    tfSell : 0x00080000,
}

var XRPtoNumber = exports.XRPtoNumber = function(str){
    return parseFloat(str) / XRP_UNIT;
}

var NumbertoXRP = exports.NumbertoXRP = function(num){
    return Math.floor(num * XRP_UNIT).toString();
}

var convertOrderBookFlags = exports.convertOrderBookFlags = function(flags){
    return Object.keys(ORDER_BOOK_FLAGS).map(function(key){
        return {
            name:key,
            value:flags & ORDER_BOOK_FLAGS[key] ? true : false
        }
    })
}

var convertOffer = exports.convertOffer = function(name, value, issuer){
    return (name === 'XRP') ? NumbertoXRP(value) :
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
        return {
            currency:v,
            issuer: (v === 'XRP') ? UInt160.ACCOUNT_ZERO : issuer,
        }
    })
    return {
        issuer_pays : w[pays].issuer,
        currency_pays : w[pays].currency,
        issuer_gets : w[gets].issuer,
        currency_gets : w[gets].currency,
    }
}

var convertOrderBookBid = exports.convertOrderBookBid = function(pair, issuer){
    var pays = 0; // buy
    var gets = 1; // sell
    return convertOrderBook(pair, issuer, pays, gets);
}

var convertOrderBookAsk = exports.convertOrderBookAsk = function(pair, issuer){
    var pays = 1; // buy
    var gets = 0; // sell
    return convertOrderBook(pair, issuer, pays, gets);
}

var convertOrderBookPriceTaker = exports.convertOrderBookPriceTaker = function(pair){
    var w = pair.toUpperCase().split('_');
    if(w[0] === 'XRP'){
        return {
            bid_amount : function(v){
                return parseFloat(v.taker_pays_funded) / XRP_UNIT;
            },
            bid_price : function(v){
                return 1 / convertOfferQuality(v.TakerGets, v.TakerPays);
            },
            ask_amount : function(v){
                return parseFloat(v.taker_gets_funded / XRP_UNIT);
            },
            ask_price : function(v){
                return convertOfferQuality(v.TakerGets, v.TakerPays);
            },
        }
    }else{
        return {
            bid_amount : function(v){
                return parseFloat(v.taker_pays_funded);
            },
            bid_price : function(v){
                return 1 / convertOfferQuality(v.TakerGets, v.TakerPays);
            },
            ask_amount : function(v){
                return parseFloat(v.taker_gets_funded);
            },
            ask_price : function(v){
                return convertOfferQuality(v.TakerGets, v.TakerPays);
            },
        }
    }
}

var convertOfferPriceTaker = exports.convertOfferPriceTaker = function(data){
    if(data instanceof Object){
        return {
            currency : data.currency,
            issuer : data.issuer,
            value : parseFloat(data.value),
        }
    }else{
        return {
            currency : "XRP",
            issuer : "",
            value : XRPtoNumber(data),
        }
    }
}

var convertOfferQuality = exports.convertOfferQuality = function(gets, pays){
    var gets = convertOfferPriceTaker(gets);
    var pays = convertOfferPriceTaker(pays);
    var quality = pays.value / gets.value;
    return quality;
}

// for bid
var adjustValueFloor = exports.adjustValueFloor = function(value, digit){
    var n = Math.pow(10, digit);
    return Math.floor(value * n) / n;
}

// for ask
var adjustValueCeil = exports.adjustValueCeil = function(value, digit){
    var n = Math.pow(10, digit);
    return Math.ceil(value * n) / n;
}

var LOG10 = Math.log(10.0);
var numberOfDigits = exports.numberOfDigits = function(value){
    return Math.floor(Math.log(value) / LOG10) + 1;
}

var moment = require('moment');
var rippleTimeToMoment = exports.rippleTimeToMoment = function(epoch){
    var BASE_TIME = 946684800;
    return moment.unix(BASE_TIME).add(epoch, 'seconds')
}


