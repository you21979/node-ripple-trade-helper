#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

api.ledgerCurrent().then(console.log).catch(console.log)

