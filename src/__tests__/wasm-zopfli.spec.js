import { promisify } from 'util';
import { inflateRaw, gunzip, inflate } from 'zlib';
import { readFileSync } from 'fs';
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

describe('zlib', () => {
  it('can deflate (deflate raw)', async () => {
    const input = 'blah';

    const compressed = await deflate(Buffer.from(input, 'utf8'));
    const decompressed = await promisify(inflateRaw)(compressed);
    const result = decompressed.toString('utf8');

    expect(result).toEqual(input);
  });

  it('can gzip', async () => {
    const input = 'blah';

    const compressed = await gzip(Buffer.from(input, 'utf8'));
    const decompressed = await promisify(gunzip)(compressed);
    const result = decompressed.toString('utf8');

    expect(result).toEqual(input);
  });

  it('can zlib (deflate)', async () => {
    const input = 'blah';

    const compressed = await zlib(Buffer.from(input, 'utf8'));
    const decompressed = await promisify(inflate)(compressed);
    const result = decompressed.toString('utf8');

    expect(result).toEqual(input);
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
