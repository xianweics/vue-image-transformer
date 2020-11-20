module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:prettier/recommended"
  ],
  env: {
    node: true,
    commonjs: true,
    es6: true,
    mocha: true
  },
  globals: {
    describe: true,
    it: true,
    expect: true,
    __dirname: true,
    window: true
  },
  rules: {
    "@typescript-eslint/no-var-requires": 0
  }
};
