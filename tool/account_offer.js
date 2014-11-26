#!/usr/bin/env node
var util = require('util');
var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi();

var opt = process.argv.splice(2)
var address = opt.shift();
var log = function(v){
    console.log(util.inspect(v, { showHidden: true, depth: null }))
}

api.accountOffers(address).then(log).catch(console.log)

