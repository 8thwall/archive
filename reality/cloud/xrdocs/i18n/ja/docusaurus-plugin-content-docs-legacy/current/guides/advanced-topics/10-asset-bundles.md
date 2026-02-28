---
id: asset-bundles
---

# 資産バンドル

8th Wallのクラウドエディターのアセットバンドル機能は、マルチファイルアセットの使用を可能にします。  これらのアセットには通常、相対パスを使用して内部的に互いを参照するファイルが含まれます。 ".glTF"、".hcap"、".msdf"、キューブマップアセットなどが一般的な例です。  これらのアセットには通常、相対パスを使用して内部的に互いを参照するファイルが含まれます。 ".glTF"、".hcap"、".msdf"、キューブマップアセットなどが一般的な例です。

.hcapファイルの場合、"main "ファイル、例えば "my-hologram.hcap "からアセットをロードします。  このファイルの中には、.mp4ファイルや.binファイルなど、依存する他のリソースへの参照がたくさんあります。  .hcapファイルの場合、"main "ファイル、例えば "my-hologram.hcap "からアセットをロードします。  このファイルの中には、.mp4ファイルや.binファイルなど、依存する他のリソースへの参照がたくさんあります。  これらのファイル名は、.hcapファイルからの相対パスを持つURLとしてメインファイルから参照され、ロードされる。  このファイルの中には、.mp4ファイルや.binファイルなど、依存する他のリソースへの参照がたくさんあります。  .hcapファイルの場合、"main "ファイル、例えば "my-hologram.hcap "からアセットをロードします。  このファイルの中には、.mp4ファイルや.binファイルなど、依存する他のリソースへの参照がたくさんあります。  これらのファイル名は、.hcapファイルからの相対パスを持つURLとしてメインファイルから参照され、ロードされる。

![AssetBundleGif](https://media.giphy.com/media/dB0va3gWqncbgPYxxJ/giphy.gif)

## アセットバンドルの作成 {#create-asset-bundle}

#### 1. ファイルの準備 {#1-prepare-your-files}

アップロード前に以下のいずれかの方法でファイルを準備してください：

- ローカルファイルシステムから個々のファイルを複数選択する
- ZIPファイルを作成する。
- アセットに必要なファイルがすべて含まれるディレクトリを探します（注意：ディレクトリのアップロードはすべてのブラウザでサポートされているわけではありません!）。

#### 2. 新しいアセットバンドルの作成 {#2-create-new-asset-bundle}

##### オプション1 {#option-1}

クラウドエディターで、**ASSETS**の右にある\*\*"+"\*\*をクリックし、"New asset bundle "を選択します。  次に、アセットタイプを選択します。  クラウドエディターで、**ASSETS**の右にある\*\*"+"\*\*をクリックし、"New asset bundle "を選択します。  次に、アセットタイプを選択します。  glTFまたはHCAPアセットをアップロードしない場合は、「その他」を選択してください。

![NewAssetBundle](/images/new-asset-bundle.jpg)

##### オプション2 {#option-2}

または、アセットまたは ZIP をクラウド エディタの右下にある [アセット] ペインに直接ドラッグすることもできます。

![NewAssetBundleDrag](/images/new-asset-bundle-drag.jpg)

#### 3. アセットバンドルのプレビュー {#3-preview-asset-bundle}

ファイルがアップロードされたら、プロジェクトに追加する前にアセットをプレビューできます。  左側のペインで個々のファイルを選択し、右側でプレビューします。  左側のペインで個々のファイルを選択し、右側でプレビューします。

![NewAssetBundlePreview](/images/new-asset-bundle-preview.jpg)

#### 4. メイン」ファイルを選択 {#4-select-main-file}

アセットタイプによってファイルを参照する必要がある場合は、このファイルを「メインファイル」として設定します。 アセットタイプによってファイルを参照する必要がある場合は、このファイルを「メインファイル」として設定します。 アセットタイプでフォルダを参照する必要がある場合（キューブマップなど）は、「メインファイル」に「none」を設定してください。

注：このステップはglTFまたはHCAPアセットには必要ありません。  これらのアセットタイプには、メインファイルが自動的に設定されます。  これらのアセットタイプには、メインファイルが自動的に設定されます。

メインファイルは後で変更できない。  間違ったファイルを選択した場合は、アセットバンドルを再アップロードする必要があります。

#### 5. アセットバンドル名の設定 {#5-set-asset-bundle-name}

アセットバンドルに名前を付けます。 アセットバンドルに名前を付けます。 これは、プロジェクト内でアセットバンドルにアクセスするためのファイル名です。

#### 6. Create Bundle" {#6-lick-create-bundle}をクリックする。

アセットバンドルのアップロードが完了し、Cloud Editorプロジェクトに追加されます。

## アセットバンドルのプレビュー {#preview-asset-bundle}

アセットはクラウド エディタ内で直接プレビューできます。  左側のアセットを選択すると、右側のプレビューが表示されます。  右側の "Show contents "メニューを展開し、バンドル内のアセットを選択することで、バンドル内の特定のアセットをプレビューすることができます。

![AssetBundlePreview](/images/asset-bundle-preview.jpg)

## アセットバンドルの名前を変更する {#rename-asset-bundle}

アセットの名前を変更するには、アセットの右にある "下矢印 "アイコンをクリックし、**名前の変更**を選択します。  アセット名を編集し、Enterキーを押して保存します。  アセットの名前を変更するには、アセットの右にある "下矢印 "アイコンをクリックし、**名前の変更**を選択します。  アセット名を編集し、Enterキーを押して保存します。  重要：アセット名を変更した場合、プロジェクト内を調べ、すべての参照が更新されたアセット名を指していることを確認する必要があります。

## アセットバンドルの削除 {#delete-asset-bundle}

アセットを削除するには、アセットの右側にある「下矢印」アイコンをクリックし、**削除**を選択します。

## アセットバンドルの参照 {#referencing-asset-bundle}

プロジェクト内の **html** ファイル（body.html など）からアセットバンドルを参照するには、**src=** または **gltf-model=** パラメータに適切なパスを指定するだけです。

アセットバンドルを **javascript** から参照するには、**require()** を使用します。

#### 例 - HTML {#example---html}

```html
<!-- Example 1 -->
<a-assets>
  <a-asset-item id="myModel" src="assets/sand-castle.gltf"></a-asset-item>
</a-assets>
<a-entity
  id="model"
  gltf-model="#myModel"
  class="cantap"
  scale="3 3 3"
  shadow="receive: false">
</a-entity>


<!-- Example 2 -->
<holo-cap
  id="holo"
  src="./assets/my-hologram.hcap"
  holo-scale="6"
  holo-touch-target="1.65 0.35"
  xrextras-hold-drag
  xrextras-two-finger-rotate
  xrextras-pinch-scale="scale: 6">
</holo-cap>
```

#### 例 - javascript {#example---javascript}

```javascript
const modelFile = require('./assets/my-model.gltf')
```
