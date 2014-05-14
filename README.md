## Install ##

-------------
```shell
git clone https://github.com/vkz/stringify.git
```

## Run ##

-------------
Should run in Chrome, Node and V8.

If you have [V8 installed][v8build] run with **[d8][v8run]** console:
```shell
#replace v8/../d8 with path d8 on your machine
v8/out/native/d8 stringify.js

#with profiling on, despite what V8 docs say
#output is written to `isolate-*-v8.log`
v8/out/native/d8 --prof stringify.js #
```

With Node:
```shell
#I don't recommend running with --prof unless you run
#recent version of Node
node stringify.js
```
In Chrome:
Open **test.html**. Output will be printed to Chrome's console.

## Results ##

-------------
**Base**: original _stringify_

**Test**: optimized _stringify_

**JSON**: V8 native _JSON.stringify_

Each test is iterated over by [Benchmark.js][] on a 100-long array of randomly generated inputs:
- flat arrays sized between 100 and 1000 cells
- nested arrays between 20 and 50 deep
- flat objects sized between 100 and 1000 properties
- nested objects between 20 and 50 deep

```shell
vkz-air:ya vkz$ clear; ./d8 stringify.js

Flat array of int
-> Base x 4.59 ops/sec ±1.85% (16 runs sampled)
-> Test x 74.95 ops/sec ±1.92% (66 runs sampled)
-> JSON x 436 ops/sec ±3.20% (95 runs sampled)

Nested array of int
-> Base x 7.00 ops/sec ±1.47% (22 runs sampled)
-> Test x 473 ops/sec ±1.77% (80 runs sampled)
-> JSON x 696 ops/sec ±0.61% (98 runs sampled)

Flat objects
-> Base x 3.46 ops/sec ±2.20% (13 runs sampled)
-> Test x 25.69 ops/sec ±5.00% (46 runs sampled)
-> JSON x 86.73 ops/sec ±0.96% (77 runs sampled)

Nested objects
-> Base x 7.10 ops/sec ±1.51% (22 runs sampled)
-> Test x 173 ops/sec ±1.15% (90 runs sampled)
-> JSON x 246 ops/sec ±0.53% (92 runs sampled)
```

[Benchmark.js]: http://benchmarkjs.com/
[v8build]:      https://code.google.com/p/v8/wiki/BuildingWithGYP
[v8run]:        https://code.google.com/p/v8/wiki/V8Profiler
