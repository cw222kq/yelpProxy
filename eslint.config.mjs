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
  rules: {
    ...pluginJs.configs.recommended.rules,
    ...tseslint.configs.recommended.rules,
    ...pluginPrettier.configs.recommended.rules,
    'prettier/prettier': 'error',
    '@typescript-eslint/no-var-requires': 'off',
  },
};