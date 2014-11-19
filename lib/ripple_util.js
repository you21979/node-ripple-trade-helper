var Promise = require('bluebird');
var async = require('async');
var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;

var convertBid = exports.convertBid =  function(v){
    var gets = Amount.from_json(v.TakerGets);
    var pays = Amount.from_json(v.TakerPays);
    var rate = gets.divide(pays).multiply(Amount.from_number(Amount.bi_xns_unit))
    return [
        rate.to_text(),
        pays.divide(Amount.from_number(Amount.bi_xns_unit)).to_text()
    ];
}
var convertAsk = exports.convertAsk = function(v){
    var gets = Amount.from_json(v.TakerGets);
    var pays = Amount.from_json(v.TakerPays);
    var rate = pays.divide(gets).multiply(Amount.from_number(Amount.bi_xns_unit))
    return [
        rate.to_text(),
        gets.divide(Amount.from_number(Amount.bi_xns_unit)).to_text()
    ];
}

var createOrderBookRequest = exports.createOrderBookRequest = function(gets, pays){
    return {
        gets: gets,
        pays: pays,
        limit: 1
    }
}




var convertOffer = exports.convertOffer = function(name, value, issuer){
    return (name === 'XRP') ? (value * 1000000).toString() :
                              {currency:name, issuer:issuer, value:value.toString()};
}

var convertCurrencyPairBid = exports.convertCurrencyPairBid = function(pair, issuer, amount, price){
    var w = pair.toUpperCase().split('_');
    return {
        buy : convertOffer(w[0], amount, issuer),
        sell : convertOffer(w[1],  amount * price, issuer),
    }
}
var convertCurrencyPairAsk = exports.convertCurrencyPairAsk = function(pair, issuer, amount, price){
    var w = pair.toUpperCase().split('_');
    return {
        buy : convertOffer(w[1], amount * price, issuer),
        sell : convertOffer(w[0], amount, issuer)
    }
}





var createAmount = exports.createAmount = function(amount, currency, issuer){
    return currency.toUpperCase() === 'XRP' ? (amount * 1000000).toString() : {
        currency : currency.toUpperCase(),
        issuer : issuer,
        value : amount.toString(),
    };
}

var convertFromOffer = exports.convertFromOffer = function(data){
// あとで直す
    var currency = "XRP";
    var value = "";
    var issuer = "";
    if(data instanceof Object){
        currency = data.currency;
        value = parseFloat(data.value);
        issuer = data.issuer;
    }else{
        value = parseFloat(data) / 1000000;
    }
    return {
        currency : currency,
        issuer : issuer,
        value : value,
    }
}
