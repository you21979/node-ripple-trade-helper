#!/usr/bin/env node
var RTH = require('../..');

var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./wallet.json", "utf8"));

var opt = process.argv.splice(2)
if(opt.length !== 1){
    console.log("%s exchange pair", process.argv[1])
    console.log(" exchange = wallet name");
    return;
}

var exchange = config[opt.shift()];

var api = RTH.createPrivateApi(exchange.address, exchange.secret, exchange.issuer);
api.accountLines(exchange.issuer).then(function(res){
    console.log(
        res.filter(function(v){return parseFloat(v.balance) !== 0}).reduce(function(r,v){
            var name = v.currency;
            if(v.balance[0] !== '-'){
                name = [v.currency, v.account].join('.')
            }
            if(!(name in r)){r[name]=0}
            r[name] += parseFloat(v.balance);
            return r;
        }, {})
    )
})
