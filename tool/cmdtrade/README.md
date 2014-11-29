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
asks
 [ { price: 27099.94103176062, amount: 2.6802903 },
  { price: 27037.01027894736, amount: 0.19 },
  { price: 27000.541551, amount: 0.948886750949058 },
  { price: 27000.263, amount: 1 },
  { price: 27000.263, amount: 1 },
  { price: 27000.263, amount: 1 },
  { price: 27000.263, amount: 1 },
  { price: 27000.263, amount: 0.994 },
  { price: 26967.03466328674, amount: 0.1484149682 },
  { price: 26961.64124, amount: 0.05 } ]
bids
 [ { price: 26676.202622667643, amount: 0.3093995028732704 },
  { price: 26676.20262000002, amount: 0.1499999999999999 },
  { price: 26673.77967457989, amount: 0.003749 },
  { price: 26666.666666666668, amount: 1.875 },
  { price: 26660.71128467071, amount: 0.1206484786416578 },
  { price: 26409.44059583334, amount: 0.2399999999999999 },
  { price: 26315.789473684214, amount: 1.13145 },
  { price: 25875.9165423077, amount: 0.52 },
  { price: 25779.840164990976, amount: 0.03879 },
  { price: 25773.71897386289, amount: 0.002684167584435773 } ]
```

4.your balance

```
./balance.js SS
{ ledger: 10226,
  seq: 97,
  funds: { BTC: 10.5, XRP: 1000050.62 } }
```




