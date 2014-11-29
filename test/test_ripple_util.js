var assert = require('power-assert');
var RippleUtil = require('../lib/ripple_util');

describe('human interface to offer', function() {
    describe('xrp_jpy', function() {
        var pair = 'xrp_jpy', issuer = '', price = 1.5, amount = 1000;
        it('offer bid', function() {
            var w = RippleUtil.convertOfferCreateBid(pair, issuer, price, amount)
            assert(w.buy === '1000000000');
            assert(w.sell instanceof Object && w.sell.value === '1500');
        });
        it('offer ask', function() {
            var w = RippleUtil.convertOfferCreateAsk(pair, issuer, price, amount)
            assert(w.buy instanceof Object && w.buy.value === '1500');
            assert(w.sell === '1000000000');
        });
    });
    describe('btc_xrp', function() {
        var pair = 'btc_xrp', issuer = '', price = 26000, amount = 1;
        it('offer bid', function() {
            var w = RippleUtil.convertOfferCreateBid(pair, issuer, price, amount)
            assert(w.buy instanceof Object);
            assert(w.buy.currency === 'BTC');
            assert(w.buy.value === '1');
            assert(w.sell === '26000000000');
        });
        it('offer ask', function() {
            var w = RippleUtil.convertOfferCreateAsk(pair, issuer, price, amount)
            assert(w.buy === '26000000000');
            assert(w.sell instanceof Object);
            assert(w.sell.currency === 'BTC');
            assert(w.sell.value === '1');
        });
    });
});
describe('orderbook offer to human', function() {
    describe('xrp_jpy', function() {
        var pair = 'xrp_jpy';
        it('book bid', function() {
            var tbl = RippleUtil.convertOrderBookPriceTaker(pair);
            var v = {
                TakerGets:
                 { currency: 'JPY',
                   issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6',
                   value: '4208.264748676359' },
                TakerPays: '2475425097',
                owner_funds: '4208.222663449724',
                taker_pays_funded:'2475400341.231899',//bid_amount
                taker_gets_funded: '4208.222663449724',
                quality:'588229.4116488536',//bid_price
            }
            assert(tbl.bid_amount(v) === 2475.400341231899);
            assert(tbl.bid_price(v) === 1.7000170005048216);
        });
        it('book ask', function() {
            var tbl = RippleUtil.convertOrderBookPriceTaker(pair);
            var v = {
                TakerGets: '12113238090',
                TakerPays:
                 { currency: 'JPY',
                   issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6',
                   value: '20823.86657515199' },
                owner_funds: '50462606093',
                quality: '0.000001719099915351535',
                taker_gets_funded: '12113238090',
                taker_pays_funded: '20823.86657515199',
            }
            assert(tbl.ask_amount(v) === 20823.86657515199);
            assert(tbl.ask_price(v) === 1.719099915351535);
        });
    });
    describe('jpy_xrp', function() {
        var pair = 'jpy_xrp';
        it('book bid', function() {
            var tbl = RippleUtil.convertOrderBookPriceTaker(pair);
            var v = {
                TakerGets: '12113238090',
                TakerPays:
                 { currency: 'JPY',
                   issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6',
                   value: '20823.86657515199' },
                owner_funds: '50462606093',
                quality: '0.000001719099915351535',
                taker_gets_funded: '12113238090',
                taker_pays_funded: '20823.86657515199',
            }
            assert(tbl.bid_amount(v) === 20823.86657515199);
            assert(tbl.bid_price(v) === 0.5816997552440181);
        });
        it('book ask', function() {
            var tbl = RippleUtil.convertOrderBookPriceTaker(pair);
            var v = {
                TakerGets:
                 { currency: 'JPY',
                   issuer: 'rMAz5ZnK73nyNUL4foAvaxdreczCkG3vA6',
                   value: '4208.264748676359' },
                TakerPays: '2475425097',
                owner_funds: '4208.222663449724',
                taker_pays_funded:'2475400341.231899',
                taker_gets_funded: '4208.222663449724',
                quality:'588229.4116488536',
            }
            assert(tbl.ask_amount(v) === 2475.400341231899);
            assert(tbl.ask_price(v) === 0.5882294116488536);
        });
    });
});
