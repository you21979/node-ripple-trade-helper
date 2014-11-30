node-ripple-trade-helper
========================

[![NPM](https://nodei.co/npm/ripple-trade-helper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ripple-trade-helper)  
[![Build Status](https://secure.travis-ci.org/you21979/node-ripple-trade-helper.png?branch=master)](https://travis-ci.org/you21979/node-ripple-trade-helper)  

what is this
------------

ripple上の取引システムを簡単に扱えるようにしたライブラリ

rippleのシステムは扱える商品が複雑なので幾つかドメインを絞っている

* 取引所（GATEWAY）単位での取り扱い
* XRPとIOUの組み合わせだけの取り扱い(USD/JPYなどのIOU1/IOU2は取り扱わない)
* ウォレットが取引所にあるかのように扱う

この制約によりビットコイン取引所に対応したトレーディングシステムに対応しやすいと思われる
nodejs製のトレーディングボットであればgekkoなど。

注）同一gatewayならIOU/IOUは解決できるので検討中

install
-------
```
git clone https://github.com/you21979/node-ripple-trade-helper.git
cd node-ripple-trade-helper
npm install
```

exchange
--------

* orderbook
* buy
* sell
* orderlist
* cancel

wallet
------

* balance
* withdraw


License
-------
MIT License

donate
------
ripple:raWU9xY9WgG8mrSZs3Gu37XFhFwcxGeDDa  
bitcoin:1GLnWVBpadWnHpxf8KpXTQdwMdHAWtzNEw  
monacoin:MCEp2NWSFc352uaDc6nQYv45qUChnKRsKK  
