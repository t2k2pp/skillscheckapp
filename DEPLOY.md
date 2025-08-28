# GitHub Pages デプロイガイド

このドキュメントでは、C++ コーディングスキルチェックアプリを GitHub Pages にデプロイする方法を説明します。

## 現在の設定（手動デプロイ）

現在のプロジェクトは `gh-pages` パッケージを使用した手動デプロイ方式を採用しています。

### 手動デプロイの手順

1. **変更をコミット・プッシュ**
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

2. **手動デプロイ実行**
   ```bash
   npm run deploy
   ```

### 手動デプロイの仕組み

- `package.json` の `scripts` セクションに定義されています
- `npm run deploy` 実行時の流れ：
  1. `predeploy` スクリプトが `npm run build` を実行
  2. Vite が `dist/` フォルダにビルド結果を生成
  3. `gh-pages -d dist` が `dist/` フォルダの内容を `gh-pages` ブランチにプッシュ
  4. GitHub Pages が自動的に `gh-pages` ブランチから配信開始

### 手動デプロイのメリット・デメリット

**メリット:**
- シンプルな設定
- デプロイのタイミングを制御できる
- 不要なデプロイを避けられる

**デメリット:**
- デプロイを忘れやすい
- 複数人での開発時に管理が複雑
- 毎回手動実行が必要

---

## 推奨設定：GitHub Actions 自動デプロイ

より効率的で現代的なアプローチとして、GitHub Actions を使用した自動デプロイを推奨します。

### GitHub Actions 自動デプロイの設定

#### 1. ワークフローファイルの作成

`.github/workflows/deploy.yml` を作成：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 2. GitHub リポジトリ設定の変更

1. GitHub リポジトリの **Settings** → **Pages** に移動
2. **Source** を "Deploy from a branch" から **"GitHub Actions"** に変更
3. 設定を保存

#### 3. 不要なファイルの削除（オプション）

`package.json` から手動デプロイ関連の設定を削除：

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
    // "predeploy": "npm run build", ← 削除
    // "deploy": "gh-pages -d dist"    ← 削除
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    // "gh-pages": "^6.3.0", ← 削除（オプション）
    "typescript": "~5.8.2",
    "vite": "^6.2.0"
  }
}
```

### 自動デプロイの動作

設定後は以下の流れで自動デプロイが実行されます：

1. `main` ブランチにコードをプッシュ
2. GitHub Actions が自動的に実行開始
3. Node.js 環境をセットアップ
4. 依存関係をインストール
5. `npm run build` でビルド実行
6. ビルド結果を GitHub Pages にデプロイ
7. 数分後に https://t2k2pp.github.io/codingskillscheckcpp/ が更新

### GitHub Actions のメリット

- **完全自動化**: コミット時に自動デプロイ
- **ビルドログ**: デプロイ状況をGitHub上で確認可能
- **ロールバック**: 以前のデプロイに簡単に戻せる
- **セキュリティ**: GitHub の公式 Actions を使用
- **スケーラブル**: 複数人開発に適している

---

## 移行手順

現在の手動デプロイから自動デプロイに移行する場合：

### ステップ1: ワークフローファイル作成
```bash
mkdir -p .github/workflows
# 上記のdeploy.ymlファイルを作成
```

### ステップ2: 設定をコミット
```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Actions auto-deploy workflow"
git push origin main
```

### ステップ3: GitHub Pages設定変更
1. リポジトリ Settings → Pages
2. Source を "GitHub Actions" に変更

### ステップ4: 初回デプロイ確認
- GitHub の Actions タブで実行状況を確認
- デプロイ完了後、サイトが正常に更新されているか確認

### ステップ5: 手動デプロイ設定の削除（オプション）
```bash
npm uninstall gh-pages
# package.jsonから関連スクリプトを削除
git commit -am "Remove manual deploy configuration"
git push origin main
```

---

## トラブルシューティング

### 自動デプロイが失敗する場合

1. **Actions タブでエラーログを確認**
   - GitHub リポジトリの Actions タブでワークフロー実行結果を確認

2. **権限の問題**
   - Settings → Pages で Source が "GitHub Actions" になっているか確認
   - ワークフローファイルの `permissions` 設定が正しいか確認

3. **ビルドエラー**
   - ローカルで `npm run build` が正常に実行されるか確認
   - 依存関係が `package.json` に正しく記載されているか確認

### 手動デプロイが失敗する場合

1. **gh-pages パッケージの問題**
   ```bash
   npm install gh-pages --save-dev
   ```

2. **ビルドエラー**
   ```bash
   npm run build  # エラーを確認
   ```

3. **権限の問題**
   - GitHub の Personal Access Token が必要な場合があります

---

## まとめ

- **現在**: 手動デプロイ（`npm run deploy`）
- **推奨**: GitHub Actions 自動デプロイ
- **移行**: 上記の手順に従って段階的に実施

自動デプロイを設定することで、開発効率が大幅に向上し、デプロイ忘れのリスクも解消されます。