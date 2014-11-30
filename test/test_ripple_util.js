var assert = require('power-assert');
var RippleUtil = require('../lib/ripple_util');
var ripplelib = require('ripple-lib');
var UInt160 = ripplelib.UInt160;

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
    describe('orderbook request', function() {
        it('convertOrderBookBid', function() {
	    var xrpjpy = RippleUtil.convertOrderBookBid('XRP_JPY', UInt160.ACCOUNT_ONE);
	    var jpyxrp = RippleUtil.convertOrderBookBid('JPY_XRP', UInt160.ACCOUNT_ONE);
            assert(xrpjpy.issuer_pays === UInt160.ACCOUNT_ZERO );
            assert(xrpjpy.currency_pays === 'XRP' );
            assert(xrpjpy.issuer_gets === UInt160.ACCOUNT_ONE );
            assert(xrpjpy.currency_gets === 'JPY' );
            assert(jpyxrp.issuer_pays === UInt160.ACCOUNT_ONE );
            assert(jpyxrp.currency_pays === 'JPY' );
            assert(jpyxrp.issuer_gets === UInt160.ACCOUNT_ZERO );
            assert(jpyxrp.currency_gets === 'XRP' );
        });
        it('convertOrderBookAsk', function() {
	    var xrpjpy = RippleUtil.convertOrderBookAsk('XRP_JPY', UInt160.ACCOUNT_ONE);
	    var jpyxrp = RippleUtil.convertOrderBookAsk('JPY_XRP', UInt160.ACCOUNT_ONE);
            assert(xrpjpy.issuer_pays === UInt160.ACCOUNT_ONE );
            assert(xrpjpy.currency_pays === 'JPY' );
            assert(xrpjpy.issuer_gets === UInt160.ACCOUNT_ZERO );
            assert(xrpjpy.currency_gets === 'XRP' );
            assert(jpyxrp.issuer_pays === UInt160.ACCOUNT_ZERO );
            assert(jpyxrp.currency_pays === 'XRP' );
            assert(jpyxrp.issuer_gets === UInt160.ACCOUNT_ONE );
            assert(jpyxrp.currency_gets === 'JPY' );
        });
    });
});
describe('offer to human', function() {
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
                taker_pays_funded:'2475400341.231899',//amount
                taker_gets_funded: '4208.222663449724',//total price
                quality:'588229.4116488536',
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
                taker_pays_funded: '20823.86657515199',//total price
                taker_gets_funded: '12113238090',//amount
            }
            assert(tbl.ask_amount(v) === 12113.23809);
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
                taker_pays_funded: '20823.86657515199',//amount
                taker_gets_funded: '12113238090',//total price
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
                quality:'588229.4116488536',
                taker_pays_funded:'2475400341.231899',//totalprice
                taker_gets_funded: '4208.222663449724',//amount
            }
            assert(tbl.ask_amount(v) === 4208.222663449724);
            assert(tbl.ask_price(v) === 0.5882294116488536);
        });
    });
    describe('btc_xrp', function() {
        var pair = 'btc_xrp';
        it('book bid', function() {
            var tbl = RippleUtil.convertOrderBookPriceTaker(pair);
            var v = {
                TakerGets: '19881064051',
                TakerPays:
                 { currency: 'BTC',
                   issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
                   value: '0.7079520169240091' },
                owner_funds: '4006263503773',
                quality: '3560936251238523e-26',
                taker_pays_funded: '0.7079520169240091',
                taker_gets_funded: '19881064051',
            }
            assert(tbl.bid_amount(v) === 0.7079520169240091);
            assert(tbl.bid_price(v) === 28082.502169259325);
        });
        it('book ask', function() {
            var tbl = RippleUtil.convertOrderBookPriceTaker(pair);
            var v = {
                TakerGets:
                 { currency: 'BTC',
                   issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
                   value: '0.059178195565561' },
                TakerPays: '1668749249',
                owner_funds: '0.0591776037895231',
                quality: '28198718008.41348',
                taker_pays_funded: '1668732561.674382',
                taker_gets_funded: '0.0591776037895231',
            }
            assert(tbl.ask_amount(v) === 0.0591776037895231);
            assert(tbl.ask_price(v) === 28198.718008413478);
        });
    });
    describe('offer tx_json', function() {
        it('OfferPriceTaker', function() {
            var v = {
                TakerGets:
                 { currency: 'BTC',
                   issuer: 'rMwjYedjc7qqtKYVLiAccJSmCwih4LnE2q',
                   value: '0.059178195565561' },
                TakerPays: '1668749249',
            }
	    assert(RippleUtil.convertOfferPriceTaker(v.TakerGets).value === 0.059178195565561);
	    assert(RippleUtil.convertOfferPriceTaker(v.TakerPays).value === 1668.749249);
        });
    });
});
describe('etc', function() {
    describe('util', function() {
        it('adjustValueFloor', function() {
            assert(RippleUtil.adjustValueFloor(0.059178195565561, 5) === 0.05917);
        });
        it('adjustValueCeil', function() {
            assert(RippleUtil.adjustValueCeil(0.059178195565561, 5) === 0.05918);
        });
        it('XRPtoNumber', function() {
            assert(RippleUtil.XRPtoNumber('1668749249') === 1668.749249);
        });
        it('NumbertoXRP', function() {
            assert(RippleUtil.NumbertoXRP(1668.749249) === '1668749249');
        });
    });
});
