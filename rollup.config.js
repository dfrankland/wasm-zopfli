import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import docker from 'rollup-plugin-docker';
import wasmModule from 'rollup-plugin-wasm-module';
import { resolve as resolvePath, dirname } from 'path';
import { dependencies } from './package.json';

const HOST = '/host';
const DIST = '/dist';

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    commonjs({
      include: ['**/rust-wrap/**/*.js'],
    }),
    babel({
      include: ['**/*.js'],
      babelrc: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            targets: {
              node: '8',
            },
          },
        ],
        '@babel/preset-stage-0',
      ],
    }),
    docker({
      include: ['**/Cargo.toml'],
      options: {
        image: 'rustlang/rust:nightly',
        createOptions: {
          Binds: [`/:${HOST}`],
        },
        command: path => [
          'sh',
          '-c',
          `
            rustup target add wasm32-unknown-unknown \
            && \
            mkdir ${DIST} \
            && \
            cd ${resolvePath(HOST, `.${dirname(path)}`)} \
            && \
            CARGO_TARGET_DIR=${DIST} \
              cargo build \
                --release \
                --target wasm32-unknown-unknown
          `,
        ],
        paths: {
          main: resolvePath(DIST, './wasm32-unknown-unknown/release/wasm-zopfli.wasm'),
        },
      },
    }),
    wasmModule({
      include: ['**/Cargo.toml'],
    }),
  ],
  external: Object.keys(dependencies),
};
