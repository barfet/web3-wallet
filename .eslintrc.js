module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier',
    ],
    plugins: ['react', '@typescript-eslint'],
    env: {
      browser: true,
      es6: true,
      node: true,
      jest: true,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Add custom rules here
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  };