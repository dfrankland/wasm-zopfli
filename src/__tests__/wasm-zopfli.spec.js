/* eslint-disable no-console */

const { gunzipSync } = require('zlib');
const zopfli = require('../../dist');

const logData = [];

const INPUT = Buffer.from('blah', 'utf8');

const OUTPUT = (data) => {
  console.log('INPUT:', INPUT.toString('utf8'));
  console.log('OUTPUT COMPRESSED:', Buffer.from(data).toString('utf8'));
  console.log('OUTPUT DECOMPRESSED:', gunzipSync(data).toString('utf8'));
  console.log('LOG:', Buffer.from(Uint8Array.from(logData)).toString('utf8'));
};

zopfli
  .gzip(INPUT, log => logData.push(log))
  .then(OUTPUT)
  .catch(console.error);
