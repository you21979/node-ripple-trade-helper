var Promise = require('bluebird');
var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var SyncWait = require('syncwait');

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

var convertBid = function(v){
    var gets = Amount.from_json(v.TakerGets);
    var pays = Amount.from_json(v.TakerPays);
    var rate = gets.divide(pays).multiply(Amount.from_number(Amount.bi_xns_unit))
    return [
        rate.to_text(),
        pays.divide(Amount.from_number(Amount.bi_xns_unit)).to_text()
    ];
}
var convertAsk = function(v){
    var gets = Amount.from_json(v.TakerGets);
    var pays = Amount.from_json(v.TakerPays);
    var rate = pays.divide(gets).multiply(Amount.from_number(Amount.bi_xns_unit))
    return [
        rate.to_text(),
        gets.divide(Amount.from_number(Amount.bi_xns_unit)).to_text()
    ];
}

var createOrderBookRequest = function(gets, pays){
    return {
        gets: gets,
        pays: pays,
        limit: 1
    }
}

var async = require('async');

// ToDo spamの排除
var bookOffers = exports.bookOffers = function(counter, base){
    var promise = new Promise(function(resolve, reject) {
        remote.connect(function() {
            var bids = [];
            var asks = [];
            async.parallel([function(next){
                var requestBids = remote.requestBookOffers(createOrderBookRequest(counter, base));
                requestBids.on('success', function(data){
                    data.offers.forEach(function(v){
                        bids.push(convertBid(v).concat(v.Account));
                    })
                    next(null);
                });
                requestBids.on('error', function(err){
                    next(err);
                });
                requestBids.request();
            },function(next){
                var requestAsks = remote.requestBookOffers(createOrderBookRequest(base, counter));
                requestAsks.on('success', function(data){
                    data.offers.forEach(function(v){
                        asks.push(convertAsk(v).concat(v.Account));
                    })
                    next(null);
                });
                requestAsks.on('error', function(err){
                    next(err);
                });
                requestAsks.request();
            }], function(err, result){
                disconnect(remote, function(){
                    if(err) reject(err);
                    else resolve({bids:bids, asks:asks});
                });
            })
        });
    })
    return promise;
}
var disconnect = function(remote, callback){
    setTimeout(function(){
        remote.disconnect();
        callback()
    }, 1000);
}

var tradeSell = exports.tradeSell = function(address, secret, counter, base){
    var promise = new Promise(function(resolve, reject) {
        remote.connect(function() {
            remote.set_secret(address, secret);
            var transaction = remote.transaction();
            transaction.offer_create({
                from: address,
                taker_pays: base,
                taker_gets: counter
                //OfferSequence: 99 //this should make each new bid replace the previous
            });
            transaction.submit(function(err, res) {
                disconnect(remote, function(){
                    if(err) reject(err);
                    else resolve(res);
                });
            });
        })
    })
    return promise;
}
var tradeBuy = exports.tradeBuy = function(address, secret, counter, base){
    var promise = new Promise(function(resolve, reject) {
        remote.connect(function() {
            remote.set_secret(address, secret);
            var transaction = remote.transaction();
            transaction.offer_create({
                from: address,
                taker_pays: counter,
                taker_gets: base
                //OfferSequence: 99 //this should make each new bid replace the previous
            });
            transaction.submit(function(err, res) {
                disconnect(remote, function(){
                    if(err) reject(err);
                    else resolve(res);
                });
            });
        })
    })
    return promise;
}
