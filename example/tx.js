var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi(Constant.ISSUER.RIPPLE_TRADE_JAPAN);

var txlist = [];
api.transaction(txlist).then(console.log);

