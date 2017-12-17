# wasm-zopfli-benchmark

A simple benchmark that runs a warmup using random bytes, then generates random
bytes for a series of modules to compress using gzip zopfli.

The current modules that this tests are:

*   [`node-zopfli`][node-zopfli]: A Node.js native addon zopfli library.

*   [`universal-zopfli-js`][universal-zopfli-js] (`@gfx/zopfli` on npm): A C++
    WebAssembly Emscripten-compiled zopfli library.

*   [`wasm-zopfli`][wasm-zopfli]: A Rust WebAssembly `rust-unknown-unknown`-
    compiled zopfli library.

[node-zopfli]: https://github.com/pierreinglebert/node-zopfli
[universal-zopfli-js]: https://github.com/gfx/universal-zopfli-js
[wasm-zopfli]: https://github.com/dfrankland/wasm-zopfli

## To Run

1.  Build `wasm-zopfli` if you haven't already done so&mdash;
    [see instructions here][build].

[build]: https://github.com/dfrankland/wasm-zopfli#development

2.  Install all dependencies.

```bash
npm install
```

3.  Build and run the benchmark.

```bash
npm run benchmark
```

4.  Wait a while... The tests might run quite slow.

## Results

These results are run on a MacBook Pro (Retina, 15-inch, Mid 2015) with a
2.2 GHz Intel Core i7 processor and 16 GB 1600 MHz DDR3 memory, running macOS
High Sierra version 10.13.2:

```
## payload size: 1
node-zopfli (native) x 177 ops/sec ±2.62% (81 runs sampled)
@gfx/zopfli (cpp wasm) x 102 ops/sec ±0.92% (78 runs sampled)
wasm-zopfli (rust wasm) x 8.82 ops/sec ±1.83% (44 runs sampled)
Fastest is node-zopfli (native)

## payload size: 1024
node-zopfli (native) x 4.59 ops/sec ±0.61% (27 runs sampled)
@gfx/zopfli (cpp wasm) x 1.67 ops/sec ±1.45% (13 runs sampled)
wasm-zopfli (rust wasm) x 0.74 ops/sec ±0.95% (8 runs sampled)
Fastest is node-zopfli (native)

## payload size: 1038336
node-zopfli (native) x 0.34 ops/sec ±3.73% (6 runs sampled)
@gfx/zopfli (cpp wasm) x 0.27 ops/sec ±3.18% (6 runs sampled)
wasm-zopfli (rust wasm) x 0.03 ops/sec ±2.60% (5 runs sampled)
Fastest is node-zopfli (native)
```
