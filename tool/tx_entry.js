#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

var opt = process.argv.splice(2)
var tx = opt.shift();
var ledger = opt.shift();

api.transactionEntry(tx, ledger).then(console.log).catch(console.log)

