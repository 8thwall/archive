---
id: importing-xrextras-into-cloud-editor
---

# XRExtras をクラウド エディタにインポートする

このセクションは、8th Wall Cloud
Editorを使用し、XRExtrasの完全にカスタマイズされたバージョンを作成する必要がある上級ユーザーを対象としています。 このプロセスには以下が含まれる： このプロセスには以下が含まれる：

- GitHubからXRExtrasのコードをクローンする
- クラウド エディタ プロジェクトにファイルをインポートする
- A-Frameコンポーネントファイルのタイプチェックを無効にする
- CDNからデフォルトのXRExtrasを取得する代わりに、ローカルのカスタムXRExtrasを使用するようにコードを更新する。

XRExtras ローディング・スクリーンの基本的なカスタマイズを行うだけであれば、
[このセクション](/legacy/guides/advanced-topics/load-screen)を参照してください。

注意: XRExtrasのコピーをCloud Editorプロジェクトにインポートすることで、CDNから利用可能な
最新のXRExtrasアップデートと機能を受け取ることができなくなります。 新しいプロジェクトを始めるときは、常に最新の
バージョンの XRExtras コードを GitHub からプルするようにしてください。 新しいプロジェクトを始めるときは、常に最新の
バージョンの XRExtras コードを GitHub からプルするようにしてください。

指示する：

1. クラウド エディタ プロジェクト内に `myxrextras` フォルダを作成します。

2. クローン <https://github.com/8thwall/web>

3. xrextras/src/\\`ディレクトリ (<https://github.com/8thwall/web/tree/master/xrextras/src>)
   の内容を、index.jsを除いてプロジェクトに追加してください。

4. プロジェクトの内容は次のようになる：

![xrextras files](/images/xrextras-import-files.jpg)

5. aframe/components`フォルダ内の**各**ファイルについて、`import`文を削除し、`// @ts-nocheck\\`に置き換える。

![xrextras disable type-checking](/images/xrextras-disable-type-checking.jpg)

6. head.htmlで、@8thwall.xrextrasの`<meta>`タグを削除するかコメントアウトして、CDNから取り込まれないようにする：

![xrextras head](/images/xrextras-import-head.jpg)

7. app.js で、ローカルの xrextras ライブラリをインポートします：

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### 画像アセットの変更／追加 {#changingadding-image-assets}

まず、新しい画像をassets/にドラッグ＆ドロップしてプロジェクトにアップロードします：

![xrextras asset](/images/xrextras-import-asset.jpg)

src\\`パラメータを持つ**html**ファイルでは、相対パスを使って画像アセットを参照します：

`<img src="​../../assets/​my-logo.png" id="loadImage" class="spin" />`

javascript\*\*ファイルでは、アセットを参照するために相対パスと `require()` を使用します：

`img.src = require('../../assets/my-logo.png')`。
