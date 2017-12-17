import { promisify } from 'util';
import {
  deflateRaw as normalDeflateRaw,
  gzip as normalGzip,
  deflate as normalDeflate,
  inflateRaw,
  gunzip,
  inflate,
} from 'zlib';
import { readFileSync } from 'fs';
import { resolve as resolvePath } from 'path';
import { runInNewContext } from 'vm';

jest.setTimeout(15000);

// This fixes a problem with Jest, which makes it freeze when importing
// `wasm-zopfli` for some reason.
const wasmZopfli = readFileSync(require.resolve('../../'), { encoding: 'utf8' });
const sandbox = {
  exports: {},
  require,
  Buffer,
  Uint8Array,
};
runInNewContext(wasmZopfli, sandbox);
const {
  exports: {
    deflate,
    gzip,
    zlib,
    zopfli,
  },
} = sandbox;

const input = readFileSync(resolvePath(__dirname, './__fixtures__/code.jpg'));

describe('zopfli', () => {
  it('can deflate (deflate raw)', async () => {
    const [
      zopfliCompressed,
      normalCompressed,
    ] = await Promise.all([
      promisify(normalDeflateRaw)(input),
      deflate(input),
    ]);

    expect(zopfliCompressed.length).toBeLessThan(normalCompressed.length);

    const decompressed = await promisify(inflateRaw)(zopfliCompressed);

    expect(decompressed).toEqual(input);
  });

  it('can gzip', async () => {
    const [
      zopfliCompressed,
      normalCompressed,
    ] = await Promise.all([
      promisify(normalGzip)(input),
      gzip(input),
    ]);

    expect(zopfliCompressed.length).toBeLessThan(normalCompressed.length);

    const decompressed = await promisify(gunzip)(zopfliCompressed);

    expect(decompressed).toEqual(input);
  });

  it('can zlib (deflate)', async () => {
    const [
      zopfliCompressed,
      normalCompressed,
    ] = await Promise.all([
      promisify(normalDeflate)(input),
      zlib(input),
    ]);

    expect(zopfliCompressed.length).toBeLessThan(normalCompressed.length);

    const decompressed = await promisify(inflate)(zopfliCompressed);

    expect(decompressed).toEqual(input);
  });

  it('checks for `Uint8Array` input', async () => {
    try {
      await zlib('blah');
    } catch (err) {
      return expect((
        () => {
          throw err;
        }
      )).toThrow('data must be a Uint8Array');
    }

    throw new Error('test failed');
  });

  it('checks for proper format given to `zopfli` function', () => {
    expect(() => zopfli('blah')).toThrow('format is invalid');
  });
});
