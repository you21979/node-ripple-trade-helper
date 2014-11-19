var Promise = require('bluebird');
var async = require('async');
var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var rippleutil = require('./ripple_util');

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

var remote = createRemote();


var disconnect = function(remote, callback){
    setTimeout(function(){
        remote.disconnect();
        callback()
    }, 100);
}


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
                        bids.push(rippleutil.convertBid(v).concat(v.Account));
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
                        asks.push(rippleutil.convertAsk(v).concat(v.Account));
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

var trade = exports.trade = function(remote, address, pays, gets){
console.log(pays,gets)
    var promise = new Promise(function(resolve, reject) {
        remote.connect(function() {
            var transaction = remote.transaction();
            transaction.offer_create({
                from: address,
                taker_pays: pays,
                taker_gets: gets,
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

var cancelOrder = exports.cancelOrder = function(remote, address, sequence){
    var promise = new Promise(function(resolve, reject) {
        remote.connect(function() {
            var transaction = remote.transaction();
            transaction.offerCancel({
                from : address,
                sequence : sequence 
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

var activeOrders = function(){
}

var withdraw = function(address, secret, dest_address, amount){
    var promise = new Promise(function(resolve, reject) {
        remote.connect(function() {
            remote.set_secret(address, secret);
            var transaction = remote.transaction();
            transaction.payment({
                account: address,
                destination: dest_address,
                amount: amount
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

