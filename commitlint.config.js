/**
 * Conventional Commits 規範檢查。
 *
 * 常用 type：feat / fix / refactor / docs / test / chore / perf / build / ci
 * 常用 scope（對應 monorepo 結構）：api / web / database / shared / config / infra / deps
 * 範例：`refactor(api): 將角色路由改為三層架構`
 *
 * @type {import('@commitlint/types').UserConfig}
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // commit 訊息以中文撰寫，大小寫規則對 CJK 無意義
    'subject-case': [0],
    // 中文說明較長，放寬 body 單行長度限制
    'body-max-line-length': [0],
    'footer-max-line-length': [0],
  },
};
