# ionic-sample

このアプリでできること。

- ユーザー登録（メールアドレス、パスワード）
- ログイン
- 掲示板への投稿確認、作成、編集、削除
- 投稿に対するコメントの確認、作成、編集、削除

## 開発環境構築

```git clone <リポジトリのURL>```

下記のファイルを作成

```src/environments/environment.ts```

```src/environments/environment.prod.ts```

下記のコマンドを実行

```ionic serve```

> ? Install @angular/cli? (Y/n)

-> Y

※　brew, nodebrew, ionicなどのインストールが必要。

## iOSシミュレータで動かす

Xcodeのインストール(https://apps.apple.com/jp/app/xcode/id497799835?mt=12)

下記のコマンドを実行すると、エミュレーターが開く。
（ソースコードをiOS用にBuildするため時間がかかる。）

```ionic cordova emulate ios```

## 本番環境（Firebase）にデプロイする

下記のコマンドを実行し、ソースコードを本番環境用にBuildする。

```ionic build --prod```

Build完了後、下記のコマンドを実行してアプリケーションをDeployする。

```firebase deploy```

Deployが完了するとHostのURLが表示される。
