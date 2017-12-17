# wasm-zopfli

WebAssembly compiled Zopfli library.

## Installation

```bash
npm install -S wasm-zopfli
```

> The awesome thing about `wasm-zopfli` is that it does not need to compile or
> download any prebuilt binaries!

## Usage

Because WebAssembly is supported on both Node.js and several browsers,
`wasm-zopfli` is super easy to use.

### Node.js

An example of compressing something and saving it to a file via Node.js.

```js
import { gzip } from 'wasm-zopfli';
import { writeFile } from 'fs';
import { promisify } from 'util';

const writeFileAsync = promisify(writeFile);

const content = Buffer.from('Hello, world!', 'utf8');

(async () => {
  try {
    const compressedContent = await gzip(content);
    await writeFileAsync('./hello_world.txt.gz', compressedContent);
  } catch (err) {
    console.error(err);
  }
})();
```

### Browser

An example of compressing something and downloading it from the browser.

```js
import { gzip } from 'wasm-zopfli';

const content = new TextEncoder('utf-8').encode('Hello, world!');

(async () => {
  try {
    const compressedContent = await gzip(content);

    const base64CompressedContent = btoa((
      compressedContent.reduce(
        (string, charCode) => `${string}${String.fromCharCode(charCode)}`,
        '',
      )
    ));

    const link = document.createElement('a');
    link.setAttribute('href', `data:application/gzip;base64,${base64CompressedContent}`);
    link.setAttribute('download', 'hello_world.txt.gz');
    link.click();
  } catch (err) {
    console.error(err);
  }
})();
```

## Documentation

### deflate(data)

*   `data` [`<Uint8Array>`][mdn uint8array]

Compress `data` using deflate. This is is referred to as "deflate raw" by
Node.js' documentation.

### gzip(data)

*   `data` [`<Uint8Array>`][mdn uint8array]

Compress `data` using gzip.

### zlib(data)

*   `data` [`<Uint8Array>`][mdn uint8array]

Compress `data` using zlib. This is is referred to as "deflate" by Node.js'
documentation.

### zopfli(format, data)

*   `format` `<FORMAT_DEFLATE>` | `<FORMAT_GZIP>` | `<FORMAT_ZLIB>`
*   `data` [`<Uint8Array>`][mdn uint8array]

The function that `deflate`, `gzip`, and `zlib` wrap. Pass any of the constants
below and data to compress.

### FORMAT_DEFLATE

Constant, reference, for compressing data with `zopfli` using deflate.

### FORMAT_GZIP

Constant, reference, for compressing data with `zopfli` using gzip.

### FORMAT_ZLIB

Constant, reference, for compressing data with `zopfli` using zlib.

[mdn uint8array]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
