/* global WebAssembly */

import { wrap } from 'kaffeerost';
import zopfliWasmModule from './zopfli/Cargo.toml';

export const FORMAT_DEFLATE = 'deflate';
export const FORMAT_GZIP = 'gzip';
export const FORMAT_ZLIB = 'zlib';

const formats = {
  [FORMAT_DEFLATE]: true,
  [FORMAT_GZIP]: true,
  [FORMAT_ZLIB]: true,
};

export const zopfli = (format) => {
  if (!formats[format]) throw new Error('format is invalid');

  return async (data, log = () => undefined) => {
    if (!(data instanceof Uint8Array)) throw new Error('data must be a Uint8Array');

    const {
      instance: {
        exports,
      } = {},
    } = await zopfliWasmModule({
      env: {
        memory: new WebAssembly.Memory({ initial: 4096, limit: 4096 }),
        log,
      },
    });

    const zopfliFormat = wrap(
      exports,
      format,
      ['&[u8]'],
      'Vec<u8>',
    );

    return zopfliFormat(data);
  };
};

export const deflate = zopfli(FORMAT_DEFLATE);
export const gzip = zopfli(FORMAT_GZIP);
export const zlib = zopfli(FORMAT_ZLIB);
