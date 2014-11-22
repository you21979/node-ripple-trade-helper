var Promise = require('bluebird');
var async = require('async');
var Remote = require('ripple-lib').Remote;
var RippleUtil = require('./ripple_util');

var promiseConnect = exports.promiseConnect = function(){
    return new Promise(function(resolve, reject) {
        var remote = RippleUtil.createRemote();
        remote.on('disconnect', function(){})
        remote.on('connect', function(){})
        remote.connect(function(){
            resolve(remote);
        });
    });
}

var defaultPromiseConnect = exports.defaultPromiseConnect = function(callback){
    var remote;
    return promiseConnect().then(function(r){remote = r;}).
    then(function(){return callback(remote)}).
    delay(50).
    then(function(res){
        remote.disconnect();
        return res;
    }).
    catch(function(err){
        remote.disconnect();
        throw err;
    })
}

var orderBook = exports.orderBook = function(remote, params){
    return new Promise(function(resolve, reject) {
        var book = remote.createOrderBook(params);
        var steps = [
            function(callback) {
                book.requestTransferRate(callback);
            },
            function(callback) {
                book.requestOffers(callback);
            },
        ];
        async.series(steps, function(err, data) {
            if(err) return reject(err);
            resolve(data[1]);
        });
    });
}

var txOfferCreate = exports.txOfferCreate = function(remote, address, pays, gets, flag){
    return new Promise(function(resolve, reject) {
        var transaction = remote.transaction();
        transaction.offerCreate({
            from: address,
            taker_pays: pays,
            taker_gets: gets,
// cancel_sequence
// expiration
        });
        transaction.setFlags(flag);
        transaction.submit(function(err, res) {
            if(err) reject(err);
            else resolve(res);
        });
    })
}

var txOfferCancel = exports.txOfferCancel = function(remote, address, sequence){
    return new Promise(function(resolve, reject) {
        var transaction = remote.transaction();
        transaction.offerCancel({
            from : address,
            sequence : sequence 
        });
        transaction.submit(function(err, res) {
            if(err) reject(err);
            else resolve(res);
        });
    })
}

var txPayment = exports.txPayment = function(remote, address, dest_address, amount){
    return new Promise(function(resolve, reject) {
        var transaction = remote.transaction();
        transaction.payment({
            account: address,
            destination: dest_address,
            amount: amount
        });
        transaction.submit(function(err, res) {
            if(err) reject(err);
            else resolve(res);
        });
    })
}

var accountOffers = exports.accountOffers = function(remote, address){
    return new Promise(function(resolve, reject) {
        var request = remote.requestAccountOffers({
            account : address,
        });
        request.on('success', function(data){
            resolve(data);
        });
        request.on('error', function(err){
            reject(err);
        });
        request.request();
    })
}
/*
{ ledger_current_index: 1,
  receive_currencies: [ 'BTC', 'JPY' ],
  send_currencies: [ 'BTC' ],
  validated: false }
*/
var accountCurrencies = exports.accountCurrencies = function(remote, address){
    return new Promise(function(resolve, reject) {
        var request = remote.requestAccountCurrencies({
            account : address,
        });
        request.on('success', function(data){
            resolve(data);
        });
        request.on('error', function(err){
            reject(err);
        });
        request.request();
    });
}
var accountBalance = exports.accountBalance = function(remote, address){
    return new Promise(function(resolve, reject) {
        var request = remote.requestAccountBalance({
            account : address,
        });
        request.on('success', function(data){
            resolve(data);
        });
        request.on('error', function(err){
            reject(err);
        });
        request.request();
    });
}
var accountLines = exports.accountLines = function(remote, address){
    return new Promise(function(resolve, reject) {
        var request = remote.requestAccountLines({
            account : address,
        });
        request.on('success', function(data){
            resolve(data);
        });
        request.on('error', function(err){
            reject(err);
        });
        request.request();
    });
}
