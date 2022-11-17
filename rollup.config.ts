import { Plugin, RollupOptions } from 'rollup';
import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' assert {type: 'json'};

const input = 'src/index.tsx';
const external = () => true;
const plugins: Plugin[] = [
  // TODO: `declarationDir: '.'` should make index.d.ts appear in dist/ instead of dist/src/,
  //       but doesn’t due to rollup.config.d.ts
  typescript({ declaration: true, outDir: 'dist' }),
  babel({
    presets: [
      ['@babel/preset-env', { targets: '> 0.25%, not dead', modules: false, loose: true }],
    ],
  }),
];

const config: RollupOptions[] = [
  { input, output: { file: pkg.main, format: 'cjs', exports: 'auto', sourcemap: true }, external, plugins },
  { input, output: { file: pkg.module, format: 'es', sourcemap: true }, external, plugins },
]

export default config;
