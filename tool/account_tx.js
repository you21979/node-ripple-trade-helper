#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

var opt = process.argv.splice(2)
var address = opt.shift();

api.accountTransactions(address).then(function(res){
    console.log(res.account, res.ledger_index_max, res.ledger_index_min, res.limit, res.marker);
    console.log(res.transactions.map(function(v){return v.tx}));
}).catch(console.log)

