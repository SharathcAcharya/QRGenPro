module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true, // Enable Node.js globals
    worker: true // Enable Service Worker globals
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'dev-dist'],
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
    'no-unused-vars': ['error', { 
      'varsIgnorePattern': '^_',
      'argsIgnorePattern': '^_' 
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
    }
  ]
}
