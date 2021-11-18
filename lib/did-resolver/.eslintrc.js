module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'airbnb',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'new-cap': 0, // constructor가 무조건 대문자로 시작해야하는 규칙 무시. 라이브러리 사용에 방해
    'no-underscore-dangle': 0, // 변수에 _ 사용 불가 무시
    'func-names': 0, // 이름 없는 함수 경고 무시
    camelcase: 0, // camelcase를 사용하지 않아도 됨
    'import/extensions': 0,
    'import/no-unresolved': 0, // import할때 확장자 무시
    'no-unused-vars': 0, // 사용하지 않는 변수 허용. type 선언만 할 경우 사용으로 간주하지 않음
  },
};
