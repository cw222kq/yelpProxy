import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import pluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config} */
export default {
  files: ['**/*.{js,mjs,cjs,ts}'],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.browser,
    },
    parser: tsParser,
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
  },
  plugins: {
    '@typescript-eslint': tseslint,
    prettier: pluginPrettier,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  rules: {
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};