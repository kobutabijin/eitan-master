# えいたんマスター

中学受験でよく使う英単語100語を、単語一覧・暗記カード・4択クイズで学習するブラウザアプリです。学習状況はブラウザの`localStorage`へ保存されます。

## 必要環境

- Node.js 22.12以降、または24系
- npm 10以降
- Chrome、Edge、Firefox、Safariの現行版

Windows PowerShellで`npm`の実行がポリシーにより拒否される場合は、以下のコマンドにある`npm`を`npm.cmd`へ読み替えてください。

## セットアップ

```powershell
npm ci
```

リポジトリのルートで実行してください。

## 開発サーバー

```powershell
npm run dev
```

表示されたURL（通常は`http://localhost:5173/`）をブラウザで開きます。

## 専用ブラウザで起動

初回だけChromiumをインストールします。

```powershell
npm run browser:install
```

次のコマンドで、アプリ専用のブラウザが自動的に開きます。

```powershell
npm run app
```

Windowsでは、リポジトリ直下の`アプリを起動.cmd`をダブルクリックしても、依存パッケージと専用ブラウザを確認してアプリを起動できます。空いているポートと新しい一時ブラウザプロファイルを自動的に使用するため、5173番ポートの競合や古いキャッシュを回避できます。ブラウザを閉じると開発サーバーも終了します。

## 品質確認

```powershell
# 静的解析
npm run lint

# 単体・コンポーネントテスト
npm test

# E2Eテスト用ブラウザの初回インストール
npx playwright install chromium

# デスクトップとスマートフォン相当のE2Eテスト
npm run test:e2e

# 本番ビルド
npm run build

# ビルド結果の確認
npm run preview
```

## 主な画面

- `/` — 学習進捗とメニュー
- `/list` — 単語検索、カテゴリ・習得状態による絞り込み
- `/flashcard` — 表裏を切り替える暗記カード
- `/quiz` — ランダムな10問の4択クイズ

## データ保存

進捗はブラウザのlocalStorageに`eitan-master-progress`というキーで保存します。保存内容が壊れている場合や旧形式の場合は、読み込み時に安全な形式へ補正します。

進捗を初期化する場合は、開発者ツールのConsoleで以下を実行してページを再読み込みしてください。

```js
localStorage.removeItem("eitan-master-progress");
location.reload();
```

## オフライン利用

アプリ本体、単語データ、表示フォントは外部サービスへ依存しません。一度配信されたファイルを端末へ保存・キャッシュする仕組みは含まれないため、URLへ初めてアクセスするときは配信サーバーへの接続が必要です。

## デプロイ

このアプリはパスに応じて画面を表示するSPAです。`/list`などへ直接アクセスした場合も`index.html`を返すよう、ホスティング側でSPAフォールバックを設定してください。

Netlify互換ホスト向けの`public/_redirects`を同梱しています。他のホストでは同等のrewriteを設定します。

## CI

GitHub Actionsでは依存導入、Lint、単体テスト、本番ビルド、E2Eテストを実行します。依存パッケージの更新確認にはDependabotやRenovate、秘密情報検出にはGitHub Secret ScanningまたはGitleaksの併用を推奨します。
