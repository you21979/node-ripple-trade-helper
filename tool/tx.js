#!/usr/bin/env node
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

var tx = process.argv.splice(2)

api.transaction(tx).then(console.log).catch(console.log)

