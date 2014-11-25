#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

api.transactionHistory(10).then(console.log).catch(console.log)

