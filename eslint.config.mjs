import stencil from '@stencil/eslint-plugin';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';

export default [
  {
    ignores: ['dist/**', 'loader/**', 'www/**', 'node_modules/**', '*.d.ts'],
  },
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: './tsconfig.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@stencil': stencil,
      '@typescript-eslint': tseslint,
      react,
    },
    rules: {
      // Stencil rules
      '@stencil/async-methods': 'error',
      '@stencil/ban-default-true': 'warn',
      '@stencil/decorators-style': ['error', { prop: 'inline', state: 'inline', element: 'inline' }],
      '@stencil/own-methods-must-be-private': 'error',
      '@stencil/prefer-vdom-listener': 'error',
      '@stencil/required-jsdoc': 'warn',
      '@stencil/reserved-member-names': 'error',
      '@stencil/single-export': 'error',
      '@stencil/strict-boolean-conditions': 'off',

      // TypeScript strict rules
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],

      // General code quality
      'no-console': 'warn',
      'no-debugger': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],

      // React/JSX (for Stencil's JSX)
      'react/jsx-no-bind': 'off',
      'react/no-unknown-property': 'off',
    },
    settings: {
      react: {
        pragma: 'h',
        version: '16.0',
      },
    },
  },
];
