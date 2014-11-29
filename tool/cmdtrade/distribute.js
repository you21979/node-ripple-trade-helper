#!/usr/bin/env node
var RTH = require('../..');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 2){
    console.log("%s exchange address amount currency", process.argv[1])
    console.log(" exchange = wallet name");
    console.log(" file = csvfile");
    return;
}

var exchange = config[opt.shift()];
var file = opt.shift();

var csvfile = fs.readFileSync(file, 'utf8');
var list = csvfile.split('\n').map(function(v){
    return v.split(',')
}).filter(function(v){return v.length > 1})

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.promise().all(list.map(function(v){
    console.log(v)
    return api.withdraw(v[0], parseFloat(v[2]), v[1]).catch(function(e){return e})
})).then(console.log).catch(console.log);



