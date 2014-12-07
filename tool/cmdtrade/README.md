CommandLine Trade Tool
======================

setup
-----

1.edit wallet.json

```
cp wallet.json.org wallet.json
vi wallet.json
```

```
"GATEWAYNAME" : {
  "issuer" : "gateway address",
  "address" : "your wallet address",
  "secret" : "your wallet secret key"
}
```

2.gateway ticker

```
./ticker.js SS BTC_XRP
BTC_XRP : 26676.2026 - 26967.0346
```

SS = snapswap

3.gateway orderbook

```
./orderbook.js SS BTC_XRP
0.23374677          |  26778        |
1.25576914          |  26753        |
0.375               |  26667        |
0.02531458          |  26600        |
0.14755264          |  26527        |
0.54603051          |  26509        |
1.0019              |  26448        |
9.8                 |  26445        |
1.82                |  26413        |
1.95014929          |  26399        |
---------------------------------------------------
                    |  26273        |  0.18140022
                    |  26259        |  1
                    |  26224        |  2.04999999
                    |  26093        |  0.14999999
                    |  26029        |  0.50852169
                    |  25999        |  3.79007923
                    |  25819        |  0.23999999
                    |  25784        |  1
                    |  25783        |  0.3
                    |  25599        |  0.3019
```

4.your balance

```
./balance.js SS
{ ledger: 10226,
  seq: 97,
  funds: { BTC: 10.5, XRP: 1000050.62 } }
```




