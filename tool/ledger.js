#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

api.ledger({
  "full": false,
  "expand": false,
  "transactions": true,
  "accounts": true
}).then(console.log).catch(console.log)

