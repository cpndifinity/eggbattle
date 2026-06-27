# たまバト

育成、進化、ミニゲーム、バトルを遊べるスマホ向けWebゲームです。

## 遊び方

`index.html` をブラウザで開くと遊べます。

スマホで遊ぶ場合は、このフォルダ全体をGitHub Pagesなどに公開して、スマホのブラウザでURLを開くのがおすすめです。

## ファイル構成

- `index.html` - ゲーム画面
- `style.css` - 見た目とスマホ対応
- `app.js` - 育成、進化、バトル、ミニゲームの処理

## GitHub Pagesで公開する手順

1. GitHubで新しいリポジトリを作る
2. このフォルダの中身をリポジトリに入れる
3. GitHubの `Settings` を開く
4. `Pages` を開く
5. `Deploy from a branch` を選ぶ
6. `main` ブランチ、`/root` を選ぶ
7. 表示されたURLをスマホで開く

## Gitを使う場合

```powershell
git init
git add .
git commit -m "Initial commit for Tamabato"
git branch -M main
git remote add origin https://github.com/YOUR_NAME/YOUR_REPO.git
git push -u origin main
```

## LINEゲームっぽくする次のステップ

- GitHub Pagesで公開する
- 公開URLをLINEで共有する
- LINEログインや友だち共有を入れたくなったら、LINE LIFFアプリ化する

