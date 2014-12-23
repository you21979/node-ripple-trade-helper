#!/usr/bin/env node
var rippleLib = require('ripple-lib');
var wallet = rippleLib.Wallet;
var x = wallet.generate();
console.log(x)
