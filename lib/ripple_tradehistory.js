var util = require('util');
var RipplePromise = require('ripple-lib-promise');
var RippleUtil = require('./ripple_util');
var Promise = RipplePromise.promise();

var isSellOrder = function(flag){
    return flag & 0x00020000 ? true : false;
}

var isMakerEvent = function(opt){

    if(opt.tx_type === 'OfferCreate'){
        switch(opt.update_type){
        case 'CreatedNode':
            return (opt.account === opt.own_account);
        case 'ModifiedNode':
            return (opt.account === opt.own_account);
        case 'DeletedNode':
            return (opt.account === opt.own_account);
        }
    }else if(opt.tx_type === 'OfferCancel'){
        return true;
    }
}
var getAffectedOffer = exports.getAffectedOffer = function(txn, account){
    return txn.meta.AffectedNodes.map(function(v){
        return Object.keys(v).map(function(key){
            return {
                type : key,
                info : v[key],
            }
        }).shift()
    }).filter(function(v){
        return v.info.LedgerEntryType === 'Offer'
    }).map(function(v){
        var fields = v.info.FinalFields || v.info.NewFields;
        var taker_gets = RippleUtil.convertOfferPriceTaker(fields.TakerGets);
        var taker_pays = RippleUtil.convertOfferPriceTaker(fields.TakerPays);
        var flags = fields.Flags ? fields.Flags : txn.tx.Flags;

        var pair = isSellOrder(flags) ? [taker_gets.currency, taker_pays.currency] : [taker_pays.currency, taker_gets.currency];
        var dir = isSellOrder(flags) ? 'sell' : 'buy';
        var amount = isSellOrder(flags) ? [taker_gets.value, taker_pays.value] : [taker_pays.value, taker_gets.value];
        var role = isMakerEvent({
            tx_type : txn.tx.TransactionType,
            update_type : v.type,
            account: account,
            own_account:txn.tx.Account,
            upd_account:v.info.Account,
        });
        var txid = v.info.PreviousTxnID ? v.info.PreviousTxnID : txn.tx.hash;
        var w = {
            txid : txid,
            pair : pair.join('_'),
            trade : dir,
            flags : flags,
            sequence : fields.Sequence,
            role : role ? 'maker' : 'taker',
            taker_gets : taker_gets,
            taker_pays : taker_pays,
            amount : amount,
            date : txn.tx.date,
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
                    date : v.date,
                    role : v.role,
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
                    date : v.date,
                    role : v.role,
                }
            })
        },
        'TrustSet' : function(account, txn){
            return [];
        },
    }
    return tbl[type]
}



