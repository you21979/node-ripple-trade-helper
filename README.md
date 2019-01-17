don't use this software
========================

* Please do not use because it is old and not maintained. Vulnerability information relating to signature is released to ripple-lib used in this version.
* https://ripple.com/dev-blog/statement-on-the-biased-nonce-sense-paper/



node-ripple-trade-helper
========================

[![NPM](https://nodei.co/npm/ripple-trade-helper.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ripple-trade-helper)  
[![Build Status](https://secure.travis-ci.org/you21979/node-ripple-trade-helper.png?branch=master)](https://travis-ci.org/you21979/node-ripple-trade-helper)
[![Coverage Status](https://coveralls.io/repos/you21979/node-ripple-trade-helper/badge.png)](https://coveralls.io/r/you21979/node-ripple-trade-helper)  

what is this
------------

ripple上の取引システムを簡単に扱えるようにしたライブラリ

rippleのシステムは扱える商品が複雑なので幾つかドメインを絞っている

* 取引所（GATEWAY）単位での取り扱い
* XRPとIOUの組み合わせだけの取り扱い(USD/JPYなどのIOU1/IOU2は同一issuerのみ対応)
* ウォレットが取引所にあるかのように扱う

この制約によりビットコイン取引所に対応したトレーディングシステムに対応しやすいと思われる
nodejs製のトレーディングボットであればgekkoなど。

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
