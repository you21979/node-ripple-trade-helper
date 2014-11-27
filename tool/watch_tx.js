#!/usr/bin/env node
var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('../lib/ripple_util');
var Promise = RipplePromise.promise();
var RTH = require('..');

var opt = process.argv.splice(2)

var offerCreate = function(tx, accounts){
    var account = 'rNXddNbin6V98gqCGjWk9UzCsaG8z1mJz4';
    var w = tx.mmeta._affectedAccounts.
        filter(function(v){return accounts.filter(function(account){ return v === account }).length});
    if(w.length)RTH.console(tx)
}
var offerCancel = function(tx, accounts){
}


RipplePromise.promiseConnect().then(function(remote){

    remote.on('transaction_all', function(v){

    switch(v.transaction.TransactionType){
    case 'OfferCreate':
        offerCreate(v, opt);
        break;
    case 'OfferCancel':
        offerCancel(v, opt);
        break;
    case 'Payment':
        break;
    defailt:
console.log(v.transaction.TransactionType);
        break;
    }
    })
//    remote.on('ledger_closed', function(v){
//    });
});

