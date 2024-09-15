import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    ignores: ['dist', 'node_modules', 'eslint.config.js'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2020,
      },
    },
  },
  {
    files: ['src/**/*.{ts,tsx}', 'src/test'],
    rules: {
      'prefer-const': 'error',
      'max-lines': ['warn', { max: 124 }],
      '@typescript-eslint/no-inferrable-types': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
);
