module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Enable Node.js globals
    worker: true, // Enable Worker globals
    serviceworker: true, // Specifically for Service Worker context
  },
  globals: {
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
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'dev-dist/**', 'node_modules/**'],
  parserOptions: { 
    ecmaVersion: 'latest', 
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: { 
    react: { version: '18.2' } 
  },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
    'no-unused-vars': ['warn', { 
      'varsIgnorePattern': '^_|[A-Z]_',
      'argsIgnorePattern': '^_|[A-Z]_',
      'ignoreRestSiblings': true,
      'caughtErrorsIgnorePattern': '^_|unused|err'
    }],
    'no-case-declarations': 'off', // Allow declarations in case blocks
    'react-hooks/exhaustive-deps': 'warn'
  },
  overrides: [
    {
      // Override for script files
      files: ['scripts/**/*.js'],
      env: {
        node: true
      },
      rules: {
        'no-undef': 'off' // Disable undefined checks for scripts
      }
    },
    {
      // Override for service worker files
      files: ['**/sw.js', '**/sw*.js', '**/workbox*.js', '**/registerSW.js', 'dev-dist/**/*.js'],
      env: {
        browser: true,
        worker: true,
        serviceworker: true,
        node: false
      },
      globals: {
        self: 'readonly',
        caches: 'readonly',
        importScripts: 'readonly',
        workbox: 'readonly',
        Response: 'readonly',
        define: 'readonly',
        _: 'readonly',
        registration: 'readonly',
        ExtendableEvent: 'readonly',
        FetchEvent: 'readonly'
      },
      rules: {
        'no-undef': 'off',
        'no-unused-vars': 'off',
        'no-empty': 'off',
        'no-constant-condition': 'off',
        'no-cond-assign': 'off',
        'no-func-assign': 'off'
      }
    },
    {
      // Override for PWA-related files
      files: ['**/*PWA*.jsx', '**/pwa/*.js'],
      env: {
        browser: true,
        serviceworker: false
      },
      globals: {
        window: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly'
      }
    }
  ]
}
