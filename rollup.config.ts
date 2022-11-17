import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

const input = 'src/index.tsx';
const deps = Object.keys({ ...pkg.dependencies, ...pkg.peerDependencies });
const external = (mod: string) => deps.some((dep) => mod.startsWith(dep));

const cjsOutput = { file: pkg.main, format: 'cjs', exports: 'auto' };
const esmOutput = { file: pkg.module, format: 'es' };
const dtsOutput = { file: pkg.types, format: 'es' };

export default [
  { input, output: cjsOutput, external, plugins: [typescript()] },
  { input, output: esmOutput, external, plugins: [typescript()] },
  { input, output: dtsOutput, plugins: [dts()] },
];
