import { readFileSync } from 'fs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { RollupOptions } from 'rollup';

const pkg = JSON.parse(readFileSync('./package.json') as unknown as string);

const input = 'src/index.tsx';
const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'auto' } as const;
const esmOutput = { file: pkg.module, format: 'es' } as const;
const dtsOutput = { file: pkg.types, format: 'es' } as const;
const external = () => true;

const config: RollupOptions[] = [
  { input, output: cjsOutput, plugins: [typescript()], external },
  { input, output: esmOutput, plugins: [typescript()], external },
  { input, output: dtsOutput, plugins: [dts()] },
];

export default config;
