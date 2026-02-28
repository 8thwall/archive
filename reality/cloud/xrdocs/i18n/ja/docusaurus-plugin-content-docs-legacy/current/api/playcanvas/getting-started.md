# PlayCanvasを始める

始めるには<https://playcanvas.com/user/the8thwall>に行き、サンプル・プロジェクトをフォークする：

- スターターキット サンプルプロジェクト
  - [画像トラッキングスターターキット](https://playcanvas.com/project/631721/overview/8th-wall-ar-image-targets)：PlayCanvasでイメージトラッキングアプリケーションを素早く作成するためのアプリケーションです。
  - [ワールドトラッキングスターターキット](https://playcanvas.com/project/631719/overview/8th-wall-ar-world-tracking)：PlayCanvas でワールドトラッキングアプリケーションを素早く作成するためのアプリケーションです。
  - [Face Effects Starter Kit](https://playcanvas.com/project/687674/overview/8th-wall-ar-face-effects)：PlayCanvas で Face Effects アプリケーションを素早く作成するためのアプリケーションです。
  - [Sky Effects Starter Kit](https://playcanvas.com/project/1055775/overview/8th-wall-sky-effects)：PlayCanvasでSky Effectsアプリケーションを素早く作成するためのアプリケーションです。
  - [ハンドトラッキング スターターキット](https://playcanvas.com/project/1115012/overview/8th-wall-ar-hand-tracking)：PlayCanvas で Hand Tracking アプリケーションを素早く作成するためのアプリケーションです。
  - [Ear Tracking Starter Kit](https://playcanvas.com/project/1158433/overview/8th-wall-ears)：  PlayCanvasでEar Trackingアプリケーションを素早く作成するためのアプリケーションです。

- その他のサンプル・プロジェクト
  - [ワールドトラッキングとフェイスエフェクト](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera)：1つのプロジェクトでワールドトラッキングとフェイスエフェクトを切り替える方法を説明する例です。
  - [カラースワップ](https://playcanvas.com/project/783654/overview/8th-wall-ar-color-swap)：簡単なUIと色の変更を含むARワールドトラッキングアプリケーションを素早く作成するためのアプリケーションです。
  - [Swap Scenes](https://playcanvas.com/project/781435/overview/8th-wall-ar-swap-scenes)：シーンを切り替えるARワールドトラッキングアプリケーションを素早く作成するためのアプリケーションです。
  - [Swap Camera](https://playcanvas.com/project/701392/overview/8th-wall-ar-swap-camera)：フロントカメラのフェイスエフェクトとバックカメラのワールドトラッキングを切り替える方法を示すアプリケーション。

## アプリのキーを追加する {#add-your-app-key}

設定 -> 外部スクリプト

以下の2つのスクリプトを追加する：

- `https://cdn.8thwall.com/web/xrextras/xrextras.js`
- `https://apps.8thwall.com/xrweb?appKey=XXXXXX`

次に、`XXXXX`を8th Wall Consoleから取得したあなた独自のApp Keyに置き換えてください。

## 透明キャンバス」を有効にする {#enable-transparent-canvas}

1. 設定」→「レンダリング」。
2. Transparent Canvas "がチェックされていることを確認してください。

## WebGL 2.0を優先する」を無効にする {#disable-prefer-webgl-20}

1. 設定」→「レンダリング」。
2. Prefer WebGL 2.0 "が**チェックされていない**ことを確認してください。

## xrcontroller.js {#add-xrcontroller}を追加する。

8th WallのサンプルPlayCanvasプロジェクトには、XRControllerゲームオブジェクトが配置されています。 空のプロジェクトから始める場合は、<https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/>から`xrcontroller.js`をダウンロードし、シーン内のEntityにアタッチします。

**注**\*：SLAMおよび/またはイメージターゲットプロジェクトに限ります。 `xrcontroller.js` と `facecontroller.js` または
`layerscontroller.js` を同時に使用することはできない。

| オプション             | 説明                                                                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ディスエイブルワールドトラッキング | もしtrueなら、効率化のためにSLAMトラッキングをオフにする。                                                                                                                                                    |
| シャドウマテリアル         | 透明な影のレシーバーとして使用するマテリアル（グランドシャドウ用など）。 通常、このマテリアルは、(0,0,0)に位置する "グラウンド "プレーンのエンティティで使用されます。 通常、このマテリアルは、(0,0,0)に位置する "グラウンド "プレーンのエンティティで使用されます。 |

## layerscontroller.jsの追加 {#add-layerscontroller}

8th WallのサンプルPlayCanvasプロジェクトには、FaceControllerゲームオブジェクトが配置されています。 8th WallのサンプルPlayCanvasプロジェクトには、FaceControllerゲームオブジェクトが配置されています。 空のプロジェクトから始める場合は、<https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/>から`layerscontroller.js`をダウンロードし、シーン内のEntityにアタッチします。

**注**\*：Sky Effectsプロジェクトに限ります。 layerscontroller.js`と `facecontroller.js`または`xrcontroller.js\` を同時に使用することはできない。

## facecontroller.js {#add-facecontroller}を追加する。

8th WallのサンプルPlayCanvasプロジェクトには、FaceControllerゲームオブジェクトが配置されています。 8th WallのサンプルPlayCanvasプロジェクトには、FaceControllerゲームオブジェクトが配置されています。 空のプロジェクトから始める場合は、<https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/>から`facecontroller.js`をダウンロードし、シーンのEntityにアタッチする。

**NOTE**：Face Effectsプロジェクトに限ります。 `facecontroller.js` と `xrcontroller.js` または
`layerscontroller.js` または `handcontroller.js` を同時に使用することはできない。

| オプション   | 説明                             |
| ------- | ------------------------------ |
| ヘッドアンカー | ワールドスペースでヘッドの根元にアンカーを打つエンティティ。 |

## handcontroller.js {#add-handcontroller}を追加する。

8番目のWallサンプルPlayCanvasプロジェクトには、HandControllerゲームオブジェクトが配置されています。 8番目のWallサンプルPlayCanvasプロジェクトには、HandControllerゲームオブジェクトが配置されています。 空のプロジェクトから始める場合は、<https://www.github.com/8thwall/web/tree/master/gettingstarted/playcanvas/scripts/>から`handcontroller.js`をダウンロードし、シーンのEntityにアタッチします。

**注**\*：ハンドトラッキングのプロジェクトに限ります。 **NOTE**：Face Effectsプロジェクトに限ります。 `facecontroller.js` と `xrcontroller.js` または
`layerscontroller.js` または `handcontroller.js` を同時に使用することはできない。

| オプション   | 説明                            |
| ------- | ----------------------------- |
| ハンドアンカー | ワールドスペースで手の付け根にアンカーを打つエンティティ。 |
