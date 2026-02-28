---
id: html
description: HTML5 バンドルをエクスポートする方法を説明します。
---

# HTML

## HTML5バンドルのエクスポート {#exporting-an-html5-bundle}

:::info[Important]
現時点では、AR体験はHTML5エクスポートではまだ提供されていない。
プロジェクトが正しく機能するためには、3Dカメラを使用する必要があります。
:::

1. HTML5のエクスポートは現在、有料アカウントでのみご利用いただけます。 詳しくは[アカウント設定](/account/settings/)をご確認ください。

2. \*\*スタジオプロジェクトを開いてください。

3. Publish**をクリックしてください。 エクスポート**セクションで、**HTML5**を選択します。

4. バンドルを構築する環境を選択します。

5. HTML5バンドルを生成するには、**Build**をクリックします。

> ビルドが完了したら、ビルドの概要に記載されているダウンロードリンクを使って `.zip` ファイルをダウンロードする。

---

## ゲーム・プラットフォームへの8th Wallプロジェクトの公開

8th Wall HTML5バンドルは完全なビルドなので、セルフホストすることも、多くのゲームプラットフォームに公開することもできます。

### セルフホスト

:::note
HTML5バンドルは、セルフホストすることも、さまざまな方法でデプロイすることもできる。 以下の説明は、`npm`を使った一例である。
セルフホスティングに関するより包括的な情報については、こちらの[ガイド](https://github.com/mikeroyal/Self-Hosting-Guide)をご覧ください。
:::

1. .zip\`バンドルファイルをダウンロードし、解凍する。
2. npm\`がまだインストールされていない場合は、この[ページ](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)の指示に従ってセットアップしてください。
3. npm install --global http-server\` を実行して、[http-server](https://www.npmjs.com/package/http-server) npmパッケージをグローバルCLIツールとしてインストールする。
4. http-server<path_to_unzipped_folder>\` を実行する。
   1. 例: `http-server /Users/John/Downloads/my-project`
5. というような一連のローカルURLを列挙したログがあるはずだ：

```sh
Available on:
  http://127.0.0.1:8080
  http://192.168.20.43:8080
  http://172.29.29.159:8080
```

6. ウェブブラウザでURLのいずれかを開く。

### イッチ・ドット・アイオ

1. .zip\`バンドルをダウンロードする。
2. [Itch.io](https://itch.io)にログインし、[新規プロジェクトを作成](https://itch.io/game/new)してください。
3. プロジェクトの詳細を記入してください：
   - プロジェクトの種類\*\*で、**HTML**を選択します。
   - アップロード**で、**ファイルのアップロード**を選択します。 ステップ1でダウンロードした `.zip` ファイルをアップロードします。 このファイルはブラウザで再生されます**チェックボックスをオンにします。
   - 埋め込みオプション\*\*で、プロジェクトに適したサイズを選択します。
4. ゲームの設定を完了し、公開します。

### 多様性

1. [Viverse](https://viverse.com)にサインインし、[Viverse Studio](https://studio.viverse.com)にアクセスしてください。
2. Upload Your Own Build**の下にある**Upload\*\*をクリックします。
3. 新しい世界を作る\*\*をクリックします。
4. プロジェクトの**名前**と**説明**を入力し、**作成**をクリックします。
5. コンテンツバージョン\*\*をクリックします。
6. 新しいバージョン\*\*」の下にある「**ファイルを選択**」をクリックします。 ステップ1でダウンロードした`.zip`ファイルをアップロードし、**アップロード**をクリックします。
7. プレビューの**iframeサポート**で、**iframe設定を適用**をクリックし、プロジェクトが必要とするすべてのパーミッションを有効にします。
   - Viverseは8th Wallからダウンロードしたあなたのプロジェクトをそれ自身のiFrameに配置し、ViverseのiFrameはあなたのプロジェクトが必要とするパーミッションを許可する必要があることに注意してください。
8. ゲームの設定を完了し、公開します。

### ゲームジョルト

1. [Game Jolt](https://gamejolt.com)にサインインし、[Game Jolt Store](https://gamejolt.com/games)にアクセスしてください。
2. Add Your Game\*\*をクリックしてください。
3. プロジェクトの詳細を入力し、**保存して次へ**をクリックします。
4. ゲームダッシュボードの **パッケージ** の下にある **パッケージを追加** をクリックします。
5. パッケージの編集\*\*で、**新規リリース**をクリックします。
6. ブラウザビルドのアップロード\*\*をクリックします。 ステップ1でダウンロードした `.zip` ファイルをアップロードします。
7. ゲームの寸法を設定するか、またはゲームを画面に合わせたい場合は、\*\*Fit to screen?\*\*を選択します。
8. ゲームの設定を完了し、公開します。

### ゲームピックス

:::info[Important]
GamePixでは、外部リンクのあるゲームを許可していません。 プロジェクトがバンドル外のネットワークコールを行わないようにしてください。
:::

1. フルHTML\*\*埋め込みコードをダウンロードする。
2. GamePix Developer Account](https://partners.gamepix.com/join-us?t=developer)にサインアップし、[GamePix Dashboard](https://my.gamepix.com/dashboard)にアクセスしてください。
3. 新しいゲームを作る\*\*をクリックします。
4. ゲームの詳細を入力し、**作成**をクリックします。
5. Info\*\*」の「**Game Engine**」から「**HTML5-JS**」を選択します。
6. Build**の下にある**Browse File\*\*をクリックします。 先ほどダウンロードした `.zip` ファイルをアップロードする。
7. ゲームの設定を完了し、公開します。

### ニューグラウンズ

1. フルHTML\*\*埋め込みコードをダウンロードしてください。 この `index.html` ファイルを `.zip` ファイルにする。
2. Newgroundsアカウント](https://www.newgrounds.com)にサインアップします。
3. 右上の矢印をクリックし、\*\*ゲーム（swf、HTML5）\*\*\*を選択します。
4. Submission File(s)\*\*の下にある、**Upload File**をクリックします。 先ほどダウンロードした `.zip` ファイルをアップロードする。
5. ゲームの寸法を設定し、**タッチスクリーンフレンドリー**をチェックする。
6. ゲームの設定を完了し、公開します。

### Y8

1. フルHTML\*\*埋め込みコードをダウンロードしてください。 この `index.html` ファイルを `.zip` ファイルにする。
2. Y8](https://www.y8.com/upload)にログインする。
3. Eメールを確認し、[無料のY8ストレージアカウントを作成](https://account.y8.com/storage_account)してください。
4. Game**で**Zip**を選択し、次に**HTML5\*\*を選択します。
5. ファイルを選択\*\*をクリックします。 先ほどダウンロードした `.zip` ファイルをアップロードする。 ストレージアカウントを作成していない場合は失敗します。 その場合は、**Create Storage Account**をクリックしてアカウントを作成し、**Upload Your Content to Y8**ページをリフレッシュして再度お試しください。
6. ゲームの設定を完了し、公開します。

### ポキ

1. Poki Developer Portal](https://developers.poki.com/share)にアクセスする。
2. プロジェクトの詳細を記入し、**Link to your game**の下にあるホストされたプロジェクトへのリンクを使用します。
3. ゲームを共有する\*\*をクリックしてください。

### コングレゲート

1. Kongregateチームにメールする [bd@kongregate.com](mailto:bd@kongregate.com). Eメールに、あなたのホストプロジェクトへのリンクを含めてください。

### アーマーゲーム

1. アーマーゲームズチームにメールする [mygame@armorgames.com](mailto:mygame@armorgames.com). Eメールに、あなたのホストプロジェクトへのリンクを含めてください。

### やみつきになるゲーム

1. フルHTML\*\*埋め込みコードをダウンロードしてください。
2. Addicting Games チームにメールする [games@addictinggames.com](mailto:games@addictinggames.com). Addicting Games Developer Center](https://www.addictinggames.com/about/upload#Send)で要求されている他のすべての情報と同様に、\`.zip\`ファイルをメールに添付してください。

### 遅延

1. LaggedチームにEメールをお送りください。[contact@lagged.com](mailto:contact@lagged.com). Eメールに、あなたのホストプロジェクトへのリンクを含めてください。
2. 承認されたら、**招待コード**を使って[Laggedアカウントにサインアップ](https://lagged.dev/signup)し、ゲームをアップロードします。

### Discord

#### サンプル・プロジェクト

プロジェクトでDiscord Embedded SDKを使用する出発点として、サンプルプロジェクトをお試しください。

1. https://www.8thwall.com/8thwall/discord-activity-example に移動し、プロジェクトをワークスペースにクローンする。
2. HTML5バンドルのエクスポート](#exporting-an-html5-bundle)の手順に従ってください。
3. .zip\`をお好きな場所にダウンロードしてください。

#### ディスコード・デベロッパーのセットアップ

Discordでウェブクライアントを実行するには、アカウントを設定し、開発者ハブでアプリを作成する必要があります。

1. Discordアカウントを作成し、https://discord.com/developers/applications。

2. 右上のボタンをクリックして、新しいアプリケーションを作成します。
   1. アプリケーションの名前を入力し、利用規約に同意する。

![New Activity](/images/studio/native-app-export/discord/new-activity.png)

3. Settings**セクションの下にある**OAuth2\*\*ページにアクセスしてください：
   1. テスト用のリダイレクトURIとして`http://127.0.0.1`を追加する。
   2. クライアントID\`を安全な場所に保存する。
   3. Reset Secret "をクリックして "Client Secret "を取得し、安全な場所に保管してください。
   4. Save "を押して設定を保存します。

![Redirect](/images/studio/native-app-export/discord/redirect.png)

4. アクティビティ**セクションの下にある**URLマッピング\*\*ページに移動します：
   1. 127.0.0.1:8888\`のように、ルートマッピングに一時的なターゲットを追加する。 これは後であなたの公開URLに置き換えられますが、次のステップでアクティビティを有効にするために必要です。

5. 設定**ページの**アクティビティ\*\*セクションに移動します：
   1. アクティビティを有効にする\*\*をトグルし、アプリランチャーの同意書に同意します。

![Enable Activity](/images/studio/native-app-export/discord/enable-activity.png)

6. 次に、**設定**セクションの下にある**インストール**タブに移動します：
   1. インストールリンク\*\*パネルからリンクをコピーし、ブラウザで開きます。
   2. アプリケーションをインストールすれば、どのサーバーやDMからもアクセスできるようになる。

#### アプリケーションの起動

1. https://github.com/8thwall/discord-activity-example、サンプル・サーバー・コードをセットアップする。
   1. `git clone https://github.com/8thwall/discord-activity-example`
   2. npm install\`を実行する。
   3. プロジェクトのフロントエンドを含む `.zip` を解凍する。
   4. レポのルートに `.env` ファイルを作成し、Discord Developer Portal の詳細情報を入力してください：
   ```
   DISCORD_CLIENT_ID=XXXXXXXXXX
   DISCORD_CLIENT_SECRET=XXXXXXXXXX
   DISCORD_CLIENT_HOST_PATH=/path/to/unzipped/folder
   ```
   5. npm start\`と入力してサーバーを起動する。

2. cloudflared\`を使用してトンネルを作成し、プロジェクトがインターネット上で一般にアクセスできるようにする。

   1. brew install cloudflared`で`cloudflared\` CLI ツールをダウンロードする。
   2. cloudflared tunnel --url http://localhost:8888\` を実行する。
   3. 生成されたURLをメモしておく。

   例

   ```
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   2025-10-11T03:05:16Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
   2025-10-11T03:05:16Z INF |  https://sporting-follow-audit-href.trycloudflare.com                                      |
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   ```

   4. ブラウザで `cloudflared` URL を開き、プロジェクトがロードされることを確認する。

3. Discordアプリケーションの設定を更新してください：
   1. Discord Developer Portalを開き、アプリケーションに移動します。
   2. アクティビティ**セクションの下にある**URLマッピング\*\*に移動します。
   3. 一時的なターゲットを `*ルートマッピング** 用の `cloudflared\` URL に置き換えてください。

![Cloudflare URL](/images/studio/native-app-export/discord/cloudflare-url.png)

4. Discordのアクティビティをテストする：
   1. Discordを開き、任意のDMまたはサーバーに移動します。
   2. 音声チャンネルコントロールのアクティビティアイコン（ゲームコントローラー）をクリックします。
   3. Apps & Commands\*\*パネルでアプリケーションを探してクリックします。

![Example Final View](/images/studio/native-app-export/discord/example-final-view.jpeg)
