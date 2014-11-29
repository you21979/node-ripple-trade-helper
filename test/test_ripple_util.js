var assert = require('power-assert');
var RippleUtil = require('../lib/ripple_util');

describe('human interface to offer', function() {
    describe('xrp_jpy', function() {
        it('offer bid', function() {
            var pair = 'xrp_jpy', issuer = '', price = 1.5, amount = 1000;
            var w = RippleUtil.convertOfferCreateBid(pair, issuer, price, amount)
            assert(w.buy === '1000000000');
            assert(w.sell instanceof Object && w.sell.value === '1500');
        });
        it('offer ask', function() {
            var pair = 'xrp_jpy', issuer = '', price = 1.5, amount = 1000;
            var w = RippleUtil.convertOfferCreateAsk(pair, issuer, price, amount)
            assert(w.buy instanceof Object && w.buy.value === '1500');
            assert(w.sell === '1000000000');
        });
    });
    describe('btc_xrp', function() {
        it('offer bid', function() {
            var pair = 'btc_xrp', issuer = '', price = 26000, amount = 1;
            var w = RippleUtil.convertOfferCreateBid(pair, issuer, price, amount)
            assert(w.buy instanceof Object);
            assert(w.buy.currency === 'BTC');
            assert(w.buy.value === '1');
            assert(w.sell === '26000000000');
        });
        it('offer ask', function() {
            var pair = 'btc_xrp', issuer = '', price = 26000, amount = 1;
            var w = RippleUtil.convertOfferCreateAsk(pair, issuer, price, amount)
            assert(w.buy === '26000000000');
            assert(w.sell instanceof Object);
            assert(w.sell.currency === 'BTC');
            assert(w.sell.value === '1');
        });
    });
});


