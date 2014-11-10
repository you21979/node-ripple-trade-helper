var rippleutil = require('./ripple_util');

var depthXrp = exports.depthXrp = function( pair, issuer ){
    var w = pair.toUpperCase().split('_');
    var base = w[0];
    var counter = w[1];
    var iou = {currency:counter, issuer:issuer};
    var xrp = {currency:base};
    return rippleutil.bookOffers(iou, base)
}

//var Constant = require('./constant');
//depth_base_xrp('XRP_JPY', ISSUER.RIPPLE_TRADE_JAPAN);
//depth_base_xrp('XRP_JPY', ISSUER.TOKYOJPY);


