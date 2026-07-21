/**
 * 共用 Prettier 設定。
 * endOfLine: 'lf' 很重要 —— 專案在 WSL/Windows 上開發，
 * 不固定換行符會造成整檔 diff 的假變更。
 *
 * @type {import("prettier").Config}
 */
export default {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  endOfLine: 'lf',
};
