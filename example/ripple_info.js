var RTH = require('..');
var Constant = RTH.Constant;
var api = RTH.createPublicApi(Constant.ISSUER.RIPPLE_TRADE_JAPAN);

api.serverInfo().then(console.log);


