# ようすことばクエスト

小学校3年生の国語「人物やものの様子を表す言葉」を学ぶWebアプリです。

公開版: https://yousu-kotoba-quest.shindo-hideto.chatgpt.site/

## 主な機能

- 42語を学べるフラッシュカード
- 3段階・各14問のレベル別クエスト
- 60秒タイムアタック
- ブラウザ内に保存されるランキング
- 問題文の読み上げ
- スマートフォン・タブレット対応

## GitHubへ登録する方法

1. GitHubで新しい空のリポジトリを作成します。
2. このフォルダ内のファイルをすべてアップロードします。
3. または、ターミナルで次を実行します。

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
git push -u origin main
```

## パソコンで動かす方法

Node.js 22.13以上が必要です。

```bash
npm install
npm run dev
```

表示されたURLをブラウザで開いてください。

## 編集する場所

- 問題・言葉・画面: `app/page.tsx`
- 色・大きさ・レイアウト: `app/globals.css`
- ページ全体の設定: `app/layout.tsx`

言葉を追加するときは、`app/page.tsx` の `FLASH_CARDS` または `MORE_FLASH_CARDS` を編集します。

## 動作確認

```bash
npm run build
```

GitHubへpushすると、GitHub Actionsでも自動的にビルド確認が行われます。

## 記録の保存について

タイムアタックのランキングは、ブラウザの `localStorage` に保存されます。サーバー上の共通ランキングではないため、端末やブラウザが変わると記録は共有されません。

