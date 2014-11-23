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

// RAII interface
var defaultPromiseConnect = exports.defaultPromiseConnect = function(callback){
    var remote;
    return promiseConnect().then(function(r){remote = r;}).
    then(function(){return callback(remote)}).
    delay(300).
    then(function(res){
        remote.disconnect();
        return res;
    }).
    catch(function(err){
        if(remote) remote.disconnect();
        throw err;
    })
}

var createTransaction = exports.createTransaction = function(remote, f){
    return new Promise(function(resolve, reject) {
        var transaction = remote.transaction();
        f(transaction, function(err){
            if(err) return reject(err);
            transaction.submit(function(err, res) {
                if(err) reject(err);
                else resolve(res);
            });
        });
    })
}

var createRequest = exports.createRequest = function(f){
    return new Promise(function(resolve, reject) {
        var request = f();
        request.on('success', function(data){
            resolve(data);
        });
        request.on('error', function(err){
            reject(err);
        });
        request.request();
    });
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
    return createTransaction(remote, function(tx, callback){
        tx.offerCreate({
            from: address,
            taker_pays: pays,
            taker_gets: gets,
// cancel_sequence
// expiration
        });
        tx.setFlags(flag);
        callback(null);
    })
}

var txOfferCancel = exports.txOfferCancel = function(remote, address, sequence){
    return createTransaction(remote, function(tx, callback){
        tx.offerCancel({
            from : address,
            sequence : sequence 
        });
        callback(null);
    })
}

var txPayment = exports.txPayment = function(remote, address, dest_address, amount, tag){
    return createTransaction(remote, function(tx, callback){
        tx.payment({
            account: address,
            destination: dest_address,
            amount: amount
        });
        if(tag) tx.destinationTag(tag);
        callback(null);
    })
}

var txTrustSet = exports.txTrustSet = function(remote, address, amount){
    return createTransaction(remote, function(tx, callback){
        tx.trustSet({
            account: address,
            limit : amount
        });
        callback(null);
    })
}

var transactionEntry = exports.transactionEntry = function(remote, hash, ledgerHash){
    return createRequest(function(){return remote.requestTransactionEntry(hash, ledgerHash)})
}
var transaction = exports.transaction = function(remote, hash){
    return createRequest(function(){return remote.requestTransaction(hash)})
}

var accountOffers = exports.accountOffers = function(remote, address){
    return createRequest(function(){
        return remote.requestAccountOffers({
            account : address,
        })
    })
}
/*
{ ledger_current_index: 1,
  receive_currencies: [ 'BTC', 'JPY' ],
  send_currencies: [ 'BTC' ],
  validated: false }
*/
var accountCurrencies = exports.accountCurrencies = function(remote, address){
    return createRequest(function(){
        return remote.requestAccountCurrencies({
            account : address,
        })
    })
}
var accountBalance = exports.accountBalance = function(remote, address){
    return createRequest(function(){
        return remote.requestAccountBalance({
            account : address,
        })
    })
}
var accountLines = exports.accountLines = function(remote, address){
    return createRequest(function(){
        return remote.requestAccountLines({
            account : address,
        })
    })
}
var serverInfo = exports.serverInfo = function(remote){
    return createRequest(function(){
        return remote.requestServerInfo()
    })
}
