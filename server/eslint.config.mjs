import { defineConfig } from 'eslint/config';

import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    compilerOptions: {
      module: 'commonjs',
      target: 'ES2020',
      outDir: './dist',
      incremental: true,
      allowSyntheticDefaultImports: true,

      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
    },
  },
  tseslint.configs.recommended,
]);
