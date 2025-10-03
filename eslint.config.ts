import type { ConfigWithExtendsArray } from '@eslint/config-helpers';
import css from '@eslint/css';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import query from '@tanstack/eslint-plugin-query';
import ban from 'eslint-plugin-ban';
import tailwind from 'eslint-plugin-better-tailwindcss';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import refresh from 'eslint-plugin-react-refresh';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const config = defineConfig([
  {
    ignores: ['node_modules/*', 'dist/*', '.vscode/*'],
  },
  perfectionist.configs['recommended-alphabetical'],
  tseslint.configs.recommended as ConfigWithExtendsArray,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          varsIgnorePattern: '^_',
        },
      ],
      'perfectionist/sort-imports': 'off',
      'perfectionist/sort-named-imports': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,cts,mts}'],
    languageOptions: {
      parserOptions: {
        project: [
          './tsconfig.json',
          './tsconfig.app.json',
          './tsconfig.node.json',
          './tsconfig.eslint.json',
        ],
      },
    },
  },
  unicorn.configs.recommended,
  {
    plugins: { ban },
    rules: {
      'ban/ban': [
        'error',
        {
          message:
            'JSON.stringify can return undefined, use stringifyJSON instead',
          name: ['JSON', 'stringify'],
        },
        {
          message: 'Prefer use toUpperCase',
          name: ['*', 'toLocaleUpperCase'],
        },
        {
          message: 'Prefer use toLowerCase',
          name: ['*', 'toLocaleLowerCase'],
        },
        {
          message: 'Avoid Promise.race since it can lead to memory leaks.',
          name: ['Promise', 'race'],
        },
        {
          message:
            'Use Promise.then(([...]) => ...) instead of Promise.spread for correctly-inferred types.',
          name: ['*', 'spread'],
        },
        {
          message: 'tsstyle#array-constructor',
          name: 'Array',
        },
        {
          message: 'Use .textContent instead. tsstyle#browser-oddities',
          name: ['*', 'innerText'],
        },
        {
          message:
            'useLayoutEffect logs lots of warnings in SSR. Use hooks/useIsomorphicLayoutEffect instead.',
          name: 'useLayoutEffect',
        },
      ],
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase',
          multipleFileExtensions: true,
        },
      ],
      'unicorn/no-null': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            dir: true,
            env: true,
            Params: true,
            params: true,
            Props: true,
            props: true,
          },
        },
      ],
    },
  },
  react.configs.flat.recommended,
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'better-tailwindcss': tailwind,
      'react-hooks': hooks,
      'react-refresh': refresh,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      ...tailwind.configs['recommended-warn'].rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unregistered-classes': [
        'warn',
        {
          ignore: [
            'toaster',
            'success',
            'description',
            'success_placeholder',
            'connectivity-error',
            'flex-spacer',
          ],
        },
      ],
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './src/styles/tailwind.css',
      },
    },
  },
  query.configs['flat/recommended'],
  {
    extends: ['json/recommended'],
    files: ['**/*.json'],
    language: 'json/json',
    plugins: { json },
  },
  {
    extends: ['json/recommended'],
    files: ['**/*.jsonc', '**/*.*rc', '**/*.*rc.json'],
    language: 'json/jsonc',
    plugins: { json },
  },
  {
    extends: ['json/recommended'],
    files: ['**/*.json5'],
    language: 'json/json5',
    plugins: { json },
  },
  {
    extends: ['markdown/recommended'],
    files: ['**/*.md'],
    language: 'markdown/commonmark',
    plugins: { markdown },
  },
  {
    extends: ['css/recommended'],
    files: ['**/*.css'],
    language: 'css/css',
    plugins: { css },
  },
  compat.extends(
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:drizzle/all',
  ),
]);

export default config;
