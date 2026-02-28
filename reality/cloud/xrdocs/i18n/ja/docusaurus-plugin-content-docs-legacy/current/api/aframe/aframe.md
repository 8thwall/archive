# XR8.AFrame

A-Frame (<https://aframe.io>) は、バーチャルリアリティ体験を構築するために設計されたウェブフレームワークである。
A-Frameプロジェクトに8th Wall Webを追加することで、ウェブ用の**拡張現実**
体験を簡単に構築できるようになりました。
A-Frameプロジェクトに8th Wall Webを追加することで、ウェブ用の**拡張現実**
体験を簡単に構築できるようになりました。

## Aフレームに8番目のウォールウェブを追加 {#adding-8th-wall-web-to-a-frame}

#### クラウド・エディター {#cloud-editor}

1. head.htmlに "meta "タグを追加するだけで、プロジェクトに "8-Frame "ライブラリーを含めることができます。 もしあなたが8th WallのA-Frameベースのテンプレートやセルフホストプロジェクトからクローンしているのであれば、それはすでにそこにあるはずです。  また、AppKeyを手動で追加する必要もありません。 もしあなたが8th WallのA-Frameベースのテンプレートやセルフホストプロジェクトからクローンしているのであれば、それはすでにそこにあるはずです。  また、AppKeyを手動で追加する必要もありません。

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### セルフ・ホスティング {#self-hosted}

8番目のウォールウェブは、簡単なステップでA-Frameプロジェクトに加えることができます：

1. A-Frame（"8-Frame "と呼ばれる）を少し修正したバージョンを含む：

<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. ページのHEADに以下のスクリプト・タグを追加する。 Xをアプリのキーに置き換えてください： Xをアプリのキーに置き換えてください：

<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## カメラの設定xrconfig\\` {#configuring-the-camera}

カメラフィードを設定するには、`xrconfig`コンポーネントを `a-scene` に追加します：

`<a-scene xrconfig>`

#### xrconfig 属性（すべてオプション） {#xrconfig-attributes}

| コンポーネント                                                    | タイプ     | デフォルト       | 説明                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------- | ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| カメラ方向                                                      | 文字列     | \`          | 使用したいカメラ back`またはfront`から選択する。 自撮りモードでは、`cameraDirection: front;`と`mirroredDisplay: true;`を使用する。 使用したいカメラ back`またはfront`から選択する。 自撮りモードでは、`cameraDirection: front;`と`mirroredDisplay: true;`を使用する。 ワールドトラッキングは `cameraDirection: back;`.\\`でのみサポートされていることに注意。 |
| 許可されたデバイス                                                  | 文字列     | モバイル・ヘッドセット | 対応デバイスクラス。 mobile-and-headsets'`、'mobile'`、'any'`から選択してください。 any'`を使用して、ウェブカメラが内蔵または接続されているラップトップまたはデスクトップタイプのデバイスを有効にします。 ワールドトラッキングは `'mobile-and-headsets'` または `mobile` でのみサポートされていることに注意してください。                                                                          |
| ミラーディスプレイ                                                  | ブーリアン   | false\\`   | trueの場合、出力ジオメトリの左右を反転し、カメラの送り方向を逆にする。 trueの場合、出力ジオメトリの左右を反転し、カメラの送り方向を逆にする。 自分撮りモードでは、`'mirroredDisplay: true;'`と`'cameraDirection: front;'`を使用します。 ワールドトラッキング(SLAM)が有効になっている場合は有効にしない。 ワールドトラッキング(SLAM)が有効になっている場合は有効にしない。             |
| disableXrTablet                                            | ブーリアン   | false\\`   | 没入型セッションでは、タブレットを表示しないようにする。                                                                                                                                                                                                                                                  |
| xrTabletStartsMinimized                                    | ブーリアン   | false\\`   | タブレットは最小化された状態で起動します。                                                                                                                                                                                                                                                         |
| disableDefaultEnvironment                                  | ブーリアン   | false\\`   | デフォルトの「ボイドスペース」背景を無効にする。                                                                                                                                                                                                                                                      |
| disableDesktopCameraControls                               | ブーリアン   | false\\`   | WASDとマウスによるカメラ操作を無効にする。                                                                                                                                                                                                                                                       |
| disableDesktopTouchEmulation                               | ブーリアン   | false\\`   | デスクトップのフェイクタッチを無効にする。                                                                                                                                                                                                                                                         |
| ディスエイブルXrTouchEmulation                                    | ブーリアン   | false\\`   | コントローラーのレイキャストに基づくタッチイベントをシーンに出さない。                                                                                                                                                                                                                                           |
| disableCameraReparenting                                   | ブーリアン   | false\\`   | カメラ→コントローラーのオブジェクト移動を無効にする                                                                                                                                                                                                                                                    |
| デフォルト環境フロアスケール                                             | 番号      | `1`         | 床の質感を縮めたり、大きくしたりする。                                                                                                                                                                                                                                                           |
| デフォルト環境床テクスチャ                                              | 資産      |             | タイル張りの床の代替テクスチャアセットまたはURLを指定します。                                                                                                                                                                                                                                              |
| デフォルト環境床色                                                  | ヘックスカラー | 1A1C2A\\`。 | 床の色を設定する。                                                                                                                                                                                                                                                                     |
| デフォルト環境霧強度                                                 | 番号      | `1`         | フォグ濃度を増減する。                                                                                                                                                                                                                                                                   |
| デフォルト環境天頂色                                                 | ヘックスカラー | BDC0D6\\`。 | ユーザーの真上にある空の色を設定する。                                                                                                                                                                                                                                                           |
| デフォルト環境空の底の色                                               | ヘックスカラー | 1A1C2A\\`。 | 地平線に空の色を設定する。                                                                                                                                                                                                                                                                 |
| defaultEnvironmentSkyGradientStrength（デフォルト環境スカイグラデーションの強さ | 番号      | `1`         | 空のグラデーションがどの程度シャープに変化するかをコントロールする。                                                                                                                                                                                                                                            |

注釈

- cameraDirection`：xrweb`を使用してワールドトラッキング(SLAM)を行う場合、`back`カメラのみ
  。 cameraDirection`：xrweb`を使用してワールドトラッキング(SLAM)を行う場合、`back`カメラのみ
  。 front`カメラを使用する場合は、`xrweb`の`disableWorldTracking: true\\` を設定してワールドトラッキングを無効にする必要があります。

## ワールドトラッキング、イメージターゲット、ライトシップ VPS: `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

ワールドトラッキングイメージターゲットやライトシップVPSが必要な場合は、`a-scene`に`xrweb`コンポーネントを追加してください：

`<a-scene xrconfig xrweb>`

#### xrweb 属性（すべてオプション） {#xrweb-attributes}

| コンポーネント           | タイプ   | デフォルト     | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----------------- | ----- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| スケール              | 文字列   | \`        | responsive'`または'absolute'`のどちらか。 responsive'`または'absolute'`のどちらか。 'responsive'` は [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) で定義された原点にフレーム1のカメラが来るように値を返します。 absolute'`はカメラ、イメージターゲットなどをメートル単位で返す。 デフォルトは`'responsive'`である。 absolute'`を使用する場合、開始ポーズのx-position、z-position、rotationは、スケールが推定されると、[`XR8.XrController.updateCameraProjectionMatrix()\`](../xrcontroller/updatecameraprojectionmatrix)で設定されたパラメータを尊重します。 y-positionは接地面からのカメラの物理的な高さに依存する。 absolute'`はカメラ、イメージターゲットなどをメートル単位で返す。 デフォルトは`'responsive'`である。 absolute'`を使用する場合、開始ポーズのx-position、z-position、rotationは、スケールが推定されると、[`XR8.XrController.updateCameraProjectionMatrix()\`](../xrcontroller/updatecameraprojectionmatrix)で設定されたパラメータを尊重します。 y-positionは接地面からのカメラの物理的な高さに依存する。 |
| ディスエイブルワールドトラッキング | ブーリアン | false\\` | もしtrueなら、効率化のためにSLAMトラッキングをオフにする。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| イネーブルVps          | ブーリアン | false\\` | もしそうなら、プロジェクト・ロケーションとメッシュを探す。 返されるメッシュはプロジェクト・ロケーションとは関係なく、プロジェクト・ロケーションが設定されていなくても返されます。 VPS を有効にすると、`scale` と `disableWorldTracking` の設定が上書きされる。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| プロジェクトウェイスポット     | 配列    | `[]`      | カンマで区切られたプロジェクトロケーション名の文字列。 カンマで区切られたプロジェクトロケーション名の文字列。 未設定または空の文字列が渡された場合、近くにあるすべてのプロジェクト所在地をローカライズします。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |

注釈

- xrweb`と`xrface\\`は同時に使用することはできない。
- xrweb`と`xrlayers`は同時に使用することができる。 その際には `xrconfig\` を使用しなければならない。
  - ベストプラクティスは常に `xrconfig` を使用することです。しかし、`xrface` や
    `xrlayers` や `xrconfig` を使わずに `xrweb` を使用すると、自動的に `xrconfig` が追加されます。 このとき、`xrweb`で設定された
    属性はすべて `xrconfig` に渡される。 このとき、`xrweb`で設定された
    属性はすべて `xrconfig` に渡される。
- cameraDirection`：ワールドトラッキング(SLAM)は`back`カメラでのみサポートされる。 
      `front`カメラを使っている場合は、`disableWorldTracking: true\`を設定してワールドトラッキングを無効にする必要があります。 cameraDirection`：ワールドトラッキング(SLAM)は`back`カメラでのみサポートされる。
  `front`カメラを使っている場合は、`disableWorldTracking: true\`を設定してワールドトラッキングを無効にする必要があります。
  `front`カメラを使っている場合は、`disableWorldTracking: true\`を設定してワールドトラッキングを無効にする必要があります。
- ワールドトラッキング（SLAM）はモバイルデバイスでのみサポートされています。

## スカイエフェクトxrlayers`と`xrlayerscene\\` {#sky-effects-xrlayers-and-xrlayerscene}

スカイ・エフェクトが欲しいなら：

1. xrlayers`コンポーネントを`a-scene\\` に追加する。
2. xrlayerscene`コンポーネントを`a-entity`に追加し、その`a-entity\\`の下に空に表示したいコンテンツを追加する。

```html
<a-scene xrconfig xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### xrlayers 属性 {#xrlayers-attributes}

なし

注釈

- xrlayers`と`xrface\\`は同時に使用することはできない。
- xrweb`と`xrlayers`は同時に使用することができる。 その際には `xrconfig\` を使用しなければならない。 xrlayers`と`xrweb`は同時に使用することができる。 その際には `xrconfig\` を使用しなければならない。
  - しかし、`xrface` や `xrweb` や `xrconfig` を使用せずに `xrlayers` を使用すると、自動的に `xrconfig` が追加されます。 このとき、`xrweb` で設定されたすべての属性は `xrconfig` に渡される。

#### xrlayerscene 属性 {#xrlayerscene-attributes}

| コンポーネント    | タイプ   | デフォルト     | 説明                                                                                                                                                                           |
| ---------- | ----- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 名称         | 文字列   | `''`      | レイヤー名。 レイヤー名。 XR8.LayersController`](../layerscontroller/layerscontroller.md) のレイヤに対応する必要があります。 現在サポートされているレイヤーは `sky\`だけである。 現在サポートされているレイヤーは`sky\` だけである。 |
| レイヤーマスクの反転 | ブーリアン | false\\` | Trueに設定すると、シーンに配置したコンテンツが空以外の領域をオカールドします。 Trueに設定すると、シーンに配置したコンテンツが空以外の領域をオカールドします。 Falseの場合、シーンに配置したコンテンツが空の領域をオカドゥルします。                                                    |
| エッジの滑らかさ   | 番号    | `0`       | レイヤーの端を滑らかにする量。 有効な値は0～1。 有効な値は0～1。                                                                                                                                          |

## フェイスエフェクトxrface\\` {#face-effects}

フェイス・エフェクトをトラッキングしたい場合は、`a-scene`に`xrface`コンポーネントを追加してください：

`<a-scene xrconfig xrface>`

#### xrface 属性 {#xrface-attributes}

| コンポーネント                                         | タイプ   | デフォルト                                                                                                              | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| メッシュジオメトリ                                       | 配列    | ['顔']\\`                                                      | 面メッシュのどの部分に三角形のインデックスを返すかを設定するカンマ区切りの文字列。 顔'`、目'`、虹彩'`、口'`の任意の組み合わせが可能である。 顔'`、目'`、虹彩'`、口'`の任意の組み合わせが可能である。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| maxDetections [オプション］ | 番号    | `1`                                                                                                                | 検出する顔の最大数。 選択肢は1、2、3のいずれか。 選択肢は1、2、3のいずれか。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| uvType [オプション］        | 文字列   | XR8.FaceController.UvType.STANDARD]\\`。 | フェーススキャンとフェースローディングのイベントで返されるuvを指定する。 オプションは[XR8.FaceController.UvType.STANDARD、XR8.FaceController.UvType.PROJECTED]\`。 フェーススキャンとフェースローディングのイベントで返されるuvを指定する。 オプションは[XR8.FaceController.UvType.STANDARD、XR8.FaceController.UvType.PROJECTED]\`。 オプションは[XR8.FaceController.UvType.STANDARD、XR8.FaceController.UvType.PROJECTED]\`。 |
| enableEars [オプション］    | ブーリアン | false\\`                                                                                                          | trueの場合、Face Effectsと同時に耳検出を実行し、耳のアタッチメントポイントを返す。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

注釈

- xrface`と`xrweb\\`は同時に使用することはできない。
- xrface`と`xrlayers\\`は同時に使用できない。
- ベストプラクティスは常に `xrconfig` を使用することですが、`xrconfig` を使用せずに `xrface` を使用すると、自動的に `xrconfig` が追加されます。 このとき、`xrface`に設定されたすべての属性が`xrconfig`に渡される。 しかし、`xrface` や `xrweb` や `xrconfig` を使用せずに `xrlayers` を使用すると、自動的に `xrconfig` が追加されます。 このとき、`xrweb` で設定されたすべての属性は `xrconfig` に渡される。

## ハンドトラッキング： `xrhand` {#hand-tracking}

ハンドトラッキングが必要な場合は、`xrhand`コンポーネントを `a-scene` に追加してください：

`<a-scene xrconfig xrhand>`

#### xrhand 属性 {#xrhand-attributes}

| コンポーネント                                        | タイプ   | デフォルト     | 説明                                                  |
| ---------------------------------------------- | ----- | --------- | --------------------------------------------------- |
| enableWrists [オプション］ | ブーリアン | false\\` | trueの場合、ハンドトラッキングと同時に手首の検出を実行し、手首のアタッチメントポイントを返します。 |

なし

注釈

- xrhand`と`xrweb\\` は同時に使用することはできない。
- xrhand`と`xrlayers\\` は同時に使用することはできない。
- xrhand`と`xrface\\` は同時に使用することはできない。

## 機能 {#functions}

| 機能                                                | 説明                                                                                                                                                        |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrconfigComponent](xrconfigcomponent.md)         | AFRAME.registerComponent()\\`で登録できるカメラ設定用のA-Frameコンポーネントを作成します。 通常、直接呼び出す必要はない。 通常、直接呼び出す必要はない。                       |
| [xrwebComponent](xrwebcomponent.md)               | AFRAME.registerComponent()\\`で登録できる、ワールドトラッキングやイメージターゲットトラッキング用のA-Frameコンポーネントを作成します。 通常、直接呼び出す必要はない。 通常、直接呼び出す必要はない。 |
| [xrlayersComponent](xrlayerscomponent.md)         | AFRAME.registerComponent()\\`で登録できるレイヤートラッキング用のA-Frameコンポーネントを作成します。 通常、直接呼び出す必要はない。 通常、直接呼び出す必要はない。                  |
| [xrfaceComponent](xrfacecomponent.md)             | AFRAME.registerComponent()\\`で登録できるFace Effectsトラッキング用のA-Frameコンポーネントを作成します。 通常、直接呼び出す必要はない。 通常、直接呼び出す必要はない。          |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | AFRAME.registerComponent()\\`で登録できるレイヤーのシーンにA-Frameコンポーネントを作成します。 通常、直接呼び出す必要はない。 通常、直接呼び出す必要はない。                     |

#### 例 - SLAM有効（デフォルト） {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### 例 - SLAM無効（画像トラッキングのみ） {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### 例 - VPS {#example---enable-vps}を有効にする

```html
<a-scene xrconfig xrweb="enableVps: true; projectWayspots=location1,location2,location3">
```

#### 例 - フロントカメラ（画像トラッキングのみ） {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection: front" xrweb="disableWorldTracking: true">
```

#### 例 - フロントカメラ スカイエフェクト {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection: front" xrlayers>
```

#### 例 - Sky + SLAM {#example---sky--slam}

```html
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### 例 - フェイス・エフェクト {#example---face-effects}

```html
<a-scene xrconfig xrface>
```

#### 例 - 耳付きフェイスエフェクト {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### 例 - ハンドトラッキング {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
