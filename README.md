# IaC Guideline

個人的にまとめたIaCのガイドライン

## 🧞 Commands

| Command              | Action                                             |
| :------------------- | :------------------------------------------------- |
| `pnpm install`       | 依存パッケージのインストール                       |
| `pnpm dev`           | ローカルdevサーバの起動 (公開先: `localhost:4321`) |
| `pnpm run build`     | サイトのビルド(ビルド先: `./dist/`)                |
| `pnpm run preview`   | ビルドしたサイトのローカルプレビュー               |
| `pnpm run astro ...` | Astroコマンドの実行                                |
| `pnpm lint`          | ESLintによるLintチェック                           |
| `pnpm format`        | Prettierによるコードフォーマット                   |
| `pnpm format:check`  | Prettierによるコードフォーマット(チェックモード)   |
| `pnpm typecheck`     | TypeScriptによる型チェック                         |
