var PublicApi = require('./lib/public_api');
var util = require('util');

exports.Constant = require('./lib/constant');
exports.createPublicApi = function(issuer){ return new PublicApi(issuer); }
exports.createPrivateApi = require('./lib/private_api');
exports.console = function(v){ console.log(util.inspect(v, { showHidden: true, depth: null })) }
