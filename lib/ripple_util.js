var Promise = require('bluebird');
var Remote = require('ripple-lib').Remote;
var Amount = require('ripple-lib').Amount;
var SyncWait = require('syncwait');

var remote = new Remote({
//         trace:   true,
     trusted:        true,
     local_signing:  true,
//   local_fee:      true,
//   fee_cushion:     1.5,
     servers: [{
        host: 's1.ripple.com'
        , port: 443
        , secure: true
     }]
});

var convertBid = function(takerGets, takerPays){
    var gets = Amount.from_json(takerGets);
    var pays = Amount.from_json(takerPays);
    var rate = gets.divide(pays).multiply(Amount.from_number(Amount.bi_xns_unit))
    return [
        rate.to_text(),
        pays.divide(Amount.from_number(Amount.bi_xns_unit)).to_text()
    ];
}
var convertAsk = function(takerGets, takerPays){
    var gets = Amount.from_json(takerGets);
    var pays = Amount.from_json(takerPays);
    var rate = pays.divide(gets).multiply(Amount.from_number(Amount.bi_xns_unit))
    return [
        rate.to_text(),
        gets.divide(Amount.from_number(Amount.bi_xns_unit)).to_text()
    ];
}

var createOrderBookRequest = function(gets, pays){
    return {
        gets: gets,
        pays: pays,
        limit: 1
    }
}

var bookOffers = exports.bookOffers = function(counter, base){
    var promise = new Promise(function(resolve, reject) {
        var requestBids = remote.requestBookOffers(createOrderBookRequest(counter, base));
        var requestAsks = remote.requestBookOffers(createOrderBookRequest(base, counter));
        remote.connect(function() {
            var sw = new SyncWait();
            sw.enter(2);
            var bids = [];
            var asks = [];
            requestBids.on('success', function(data){
                data.offers.forEach(function(v){
                    bids.push(convertBid(v.TakerGets, v.TakerPays).concat(v.Account));
                })
                sw.leave(null);
            });
            requestBids.on('error', function(err){
                sw.leave(err);
            });
            requestAsks.on('success', function(data){
                data.offers.forEach(function(v){
                    asks.push(convertAsk(v.TakerGets, v.TakerPays).concat(v.Account));
                })
                sw.leave(null);
            });
            requestAsks.on('error', function(err){
                sw.leave(err);
            });
            sw.fail(function(err){
                reject(err);
                remote.disconnect();
            })
            sw.done(function(){
                resolve({bids:bids, asks:asks});
                remote.disconnect();
            })
            requestBids.request();
            requestAsks.request();
        });
    })
    return promise;
}

