var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var Promise = RipplePromise.promise();

var getAffectedOffer = exports.getAffectedOffer = function(txn, account){
    return txn.meta.AffectedNodes.map(function(v){
        return Object.keys(v).map(function(key){
            var fields = v[key].FinalFields || v[key].NewFields;
            return {
                type : key,
                account : fields.Account,
                ledgerentrytype : v[key].LedgerEntryType,
                hash : txn.tx.hash,
                fields : fields,
                info : v[key],
            }
        }).shift()
    }).filter(function(v){
        return v.account === account && v.ledgerentrytype === 'Offer'
    }).map(function(v){
        var fields = v.fields;
        var taker_gets = RippleUtil.convertOfferPriceTaker(fields.TakerGets);
        var taker_pays = RippleUtil.convertOfferPriceTaker(fields.TakerPays);
        var flags = fields.Flags ? fields.Flags : txn.tx.Flags;
        var pair = flags & 0x00020000 ? [taker_gets.currency, taker_pays.currency] : [taker_pays.currency, taker_gets.currency];
        var amount = flags & 0x00020000 ? [taker_gets.value, taker_pays.value] : [taker_pays.value, taker_gets.value];
        var w = {
            pair : pair.join('_'),
            trade : flags & 0x00020000 ? 'sell' : 'buy',
            flags : flags,
            sequence : fields.Sequence,
            taker_gets : taker_gets,
            taker_pays : taker_pays,
            amount : amount,
        }
        Object.keys(v).forEach(function(k){
            w[k] = v[k]
        })
        return w;
    })
}

var getTransaction = exports.getTransaction = function(type){
    var tbl = {
        'Payment': function(account, txn){
            return [];
        },
        'OfferCreate': function(account, txn){
            var tbl = {
                'CreatedNode' : 'order',
                'DeletedNode' : 'all',
                'ModifiedNode' : 'part',
            }
            return getAffectedOffer(txn, account).map(function(v){
                return {
                    state : tbl[v.type],
                    orderid : v.sequence,
                    pair : v.pair,
                    trade : v.trade,
                    taker_gets : v.taker_gets,
                    taker_pays : v.taker_pays,
                    amount : v.amount,
                }
            })
        },
        'OfferCancel' : function(account, txn){
            return getAffectedOffer(txn, account).map(function(v){
                return {
                    state : 'cancel',
                    orderid : v.sequence,
                    pair : v.pair,
                    trade : v.trade,
                    taker_gets : v.taker_gets,
                    taker_pays : v.taker_pays,
                    amount : v.amount,
                }
            })
        },
        'TrustSet' : function(account, txn){
            return [];
        },
    }
    return tbl[type]
}

