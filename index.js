var PublicApi = require('./lib/public_api');
var PublicStream = require('./lib/public_stream');
var PrivateApi = require('./lib/private_api');
var PrivateStream = require('./lib/private_stream');
var util = require('util');

exports.Constant = require('./lib/constant');
exports.createPublicApi = function(issuer){ return new PublicApi(issuer); }
exports.createPublicStream = function(issuer){ return new PublicStream(issuer); }
exports.createPrivateApi = PrivateApi;
exports.createPrivateStream = PrivateStream;
exports.util = require('./lib/ripple_util');
exports.console = function(v){ console.log(util.inspect(v, { showHidden: true, depth: null })) }
