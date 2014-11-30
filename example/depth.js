var RTH = require('..');
var Constant = require('./constant');
var api = RTH.createPublicApi(Constant.ISSUER.RIPPLE_TRADE_JAPAN);

api.orderBook('XRP_JPY').then(console.log)


