var PublicApi = require('./lib/public_api');
var PrivateApi = require('./lib/private_api');
var util = require('util');

exports.Constant = require('./lib/constant');
exports.createPublicApi = function(issuer){ return new PublicApi(issuer); }
exports.createPrivateApi = PrivateApi;
exports.util = require('./lib/ripple_util');
exports.console = function(v){ console.log(util.inspect(v, { showHidden: true, depth: null })) }
