import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  { ignores: [
    'dist/**',
    'dev-dist/**',
    'build/**',
    'node_modules/**',
    '.eslintrc.cjs',
    'vite.config.js.timestamp-*'
  ]},
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.serviceworker,
        define: 'readonly',
        _: 'readonly',
        importScripts: 'readonly',
        self: 'readonly',
        process: 'readonly',
        Response: 'readonly',
        workbox: 'readonly',
        ExtendableEvent: 'readonly',
        FetchEvent: 'readonly',
        registration: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]|^_',
        argsIgnorePattern: '^[A-Z_]|^_',
        caughtErrorsIgnorePattern: '^_|unused|err',
        ignoreRestSiblings: true 
      }],
      'no-case-declarations': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Service worker files
  {
    files: ['**/sw.js', '**/sw*.js', '**/workbox*.js', '**/registerSW.js', 'dev-dist/**/*.js'],
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'off',
      'no-constant-condition': 'off',
      'no-cond-assign': 'off',
      'no-func-assign': 'off'
    }
  }
])
