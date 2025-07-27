export default {
  extends: ['@commitlint/config-conventional'],
  // Можно добавить свои правила:
  rules: {
    'header-max-length': [2, 'always', 72],
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'refactor', 'style', 'test', 'chore'],
    ],
    'subject-empty': [2, 'never'],
  },
};
