module.exports = {
  extends: ['eslint-config-standard', 'next/core-web-vitals'],
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        // imports: 'never',
        // exports: 'never',
        // functions: 'never',
      },
    ],
    'space-before-function-paren': [
      'error',
      {
        // anonymous: 'always',
        named: 'never',
        // asyncArrow: 'always',
      },
    ],
  },
}
