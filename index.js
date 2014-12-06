var PublicApi = require('./lib/public_api');
var PublicStream = require('./lib/public_stream');
var PrivateApi = require('./lib/private_api');
var PrivateStream = require('./lib/private_stream');
var Promise = require('bluebird');
var util = require('util');

exports.promise = function(){ return Promise }
exports.Constant = require('./lib/constant');
exports.createPublicApi = function(issuer){ return new PublicApi(issuer); }
exports.createPublicStream = function(issuer){ return new PublicStream(issuer); }
exports.createPrivateApi = function(myaddress, secret, issuer){
    return new PrivateApi(issuer, myaddress, secret);
}
exports.createPrivateStream = function(myaddress, secret, issuer){
    return new PrivateStream(issuer, myaddress, secret);
}
exports.util = require('./lib/ripple_util');
exports.console = function(v){ console.log(util.inspect(v, { showHidden: true, depth: null })) }
