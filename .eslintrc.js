'use strict';

module.exports = {
  root: true,
  extends: 'eslint:recommended',
  env: {
    browser: true,
    node:    true,
    es6:     true
  },
  rules: {
    'indent':          [2, 2],
    'linebreak-style': [2, 'unix'],
    'quotes':          [1, 'single']
  }
};
