/* global WebAssembly */

import { wrap } from 'kaffeerost';
import zopfliWasmModule from './zopfli/Cargo.toml';

export const FORMAT_DEFLATE = {};
export const FORMAT_GZIP = {};
export const FORMAT_ZLIB = {};

const formats = new Map([
  [FORMAT_DEFLATE, 'deflate'],
  [FORMAT_GZIP, 'gzip'],
  [FORMAT_ZLIB, 'zlib'],
]);

export const zopfli = async (format, data) => {
  if (!formats.has(format)) throw new Error('format is invalid');
  if (!(data instanceof Uint8Array)) throw new Error('data must be a Uint8Array');

  const {
    instance: {
      exports,
    } = {},
  } = await zopfliWasmModule({
    env: {
      memory: new WebAssembly.Memory({ initial: 4096, limit: 4096 }),
      log: x => Math.log(x),
    },
  });

  const zopfliFormat = wrap(
    exports,
    formats.get(format),
    ['&[u8]'],
    'Vec<u8>',
  );

  return zopfliFormat(data);
};

export const deflate = (...args) => zopfli(FORMAT_DEFLATE, ...args);
export const gzip = (...args) => zopfli(FORMAT_GZIP, ...args);
export const zlib = (...args) => zopfli(FORMAT_ZLIB, ...args);
