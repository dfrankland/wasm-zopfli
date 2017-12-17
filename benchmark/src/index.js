/* eslint-disable no-console */

import { randomBytes } from 'crypto';
import { Suite } from 'benchmark';
import { promisify } from 'util';

import { gzip as nativeGzip } from 'node-zopfli';
import { gzip as cppGzip } from '@gfx/zopfli';
import { gzip as rustGzip } from 'wasm-zopfli';

const implementations = [
  { name: 'node-zopfli', type: 'native', method: promisify(nativeGzip) },
  { name: '@gfx/zopfli', type: 'cpp wasm', method: promisify(cppGzip) },
  { name: 'wasm-zopfli', type: 'rust wasm', method: rustGzip },
];

(async () => {
  // warmup
  await Promise.all((
    implementations.map((
      ({ method }) => method(randomBytes(1024 * 1024), {})
    ))
  ));

  const benchmarks = [1, 1024, 1024 * 1014].map((
    size => () => new Promise(async (resolve) => {
      console.log(`\n## payload size: ${size}`);

      const bytes = randomBytes(size);

      const fullSuite = implementations.reduce(
        (suite, { name, type, method }) => (
          suite.add(`${name} (${type})`, {
            defer: true,
            fn: async (deffered) => {
              await method(bytes, {});
              deffered.resolve();
            },
          })
        ),
        new Suite(),
      );

      fullSuite
        .on('cycle', (event) => {
          console.log(`${event.target}`);
        })
        .on('complete', () => {
          console.log(`Fastest is ${fullSuite.filter('fastest').map('name')}`);
          resolve();
        })
        .run({ async: true });
    })
  ));

  await benchmarks.reduce(
    async (promiseChain, benchmark) => {
      await promiseChain;
      await benchmark();
    },
    Promise.resolve(),
  );
})();
