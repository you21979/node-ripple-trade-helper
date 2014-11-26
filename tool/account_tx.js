#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

var opt = process.argv.splice(2)
var address = opt.shift();

api.accountTransactions(address).then(RTH.console).catch(console.log)



