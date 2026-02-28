---
sidebar_label: 実行()
---

# XR8.run()

`XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)`.

## 説明 {#description}

カメラを開き、カメラ・ラン・ループの実行を開始する。

## パラメータ {#parameters}

| プロパティ                                                                                                                                                               | タイプ                                                    | デフォルト                                                                                                                                                       | 説明                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| キャンバス                                                                                                                                                               | HTMLCanvasElement\\`                                  |                                                                                                                                                             | カメラフィードが描画されるHTMLキャンバス。                                                                                                                                                                                                                   |
| webgl2 [オプション］                                                                                                                            | ブーリアン                                                  | true\\`                                                                                                                                                    | trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  false の場合、常に WebGL1 を使用します。                           |
| ownRunLoop [オプション］                                                                                                                        | ブーリアン                                                  | true\\`                                                                                                                                                    | もしtrueなら、XRはそれ自身のランループを使うはずだ。  もしtrueなら、XRはそれ自身のランループを使うはずだ。  falseの場合、実行ループを自分で用意し、[runPreRender](runprerender.md)と[runPostRender](runpostrender.md)を自分で呼び出すことになります。                                                                     |
| cameraConfig： {direction} [オプション］                                                                                                         | オブジェクト                                                 | `{direction：XR8.XrConfig.camera().BACK}`。                                                                                                                   | 使用したいカメラ 使用したいカメラ 使用可能な`direction`の値は`XR8.XrConfig.camera().BACK`または`XR8.XrConfig.camera().FRONT`です。                                                                                                                                      |
| glContextConfig [オプション]。                                                                                        | WebGLContextAttributes\\`。                            | null\\`。                                                                                                                                                   | WebGL canvas コンテキストを設定する属性。                                                                                                                                                                                                               |
| allowedDevices [オプション］                                                                                                                    | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | XR8.XrConfig.device().MOBILE_AND_HEADSETS\\`。 | パイプラインを実行するデバイスのクラスを指定する。  現在のデバイスがそのクラスでない場合、カメラを開く前に実行が失敗します。 allowedDevicesが`XR8.XrConfig.device().ANY`の場合、常にカメラを開きます。 ワールドトラッキングは `XR8.XrConfig.device().MOBILE_AND_HEADSETS` または `XR8.XrConfig.device().MOBILE` でのみ使用できることに注意してください。 |
| sessionConfiguration: `{disableXrTablet, xrTabletStartsMinimized, defaultEnvironment}` [オプション]。 | オブジェクト                                                 | `{}`                                                                                                                                                        | 様々なタイプのセッションに関するオプションを設定する。                                                                                                                                                                                                               |

sessionConfiguration\\`は以下の[Optional]プロパティを持つオブジェクトである：

| プロパティ                                                                                                                                                                                              | タイプ    | デフォルト     | 説明                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | --------- | -------------------------------- |
| disableXrTablet［オプション］                                                                                                                                                                             | ブーリアン  | false\\` | 没入型セッションでは、タブレットを表示しないようにする。     |
| xrTabletStartsMinimized [オプション]。                                                                                                               | ブーリアン  | false\\` | タブレットは最小化された状態で起動します。            |
| defaultEnvironment `{disabled, floorScale, floorTexture, floorColor, fogIntensity, skyTopColor, skyBottomColor, skyGradientStrength}` [オプション]。 | オブジェクト | {}        | 没入型セッションのデフォルト環境に関するオプションを設定します。 |

defaultEnvironment\\`は以下の[Optional]プロパティを持つオブジェクトである：

| プロパティ                                                                            | タイプ     | デフォルト       | 説明                                 |
| -------------------------------------------------------------------------------- | ------- | ----------- | ---------------------------------- |
| disabled [オプション］                                       | ブーリアン   | false\\`   | デフォルトの「ボイドスペース」背景を無効にする。           |
| floorScale [オプション］                                     | 番号      | `1`         | 床の質感を縮めたり、大きくしたりする。                |
| floorTexture [オプション］                                   | 資産      |             | タイル張りの床の代替テクスチャアセットまたはURLを指定します。   |
| floorColor [オプション］                                     | ヘックスカラー | 1A1C2A\\`。 | 床の色を設定する。                          |
| fogIntensity [オプション］                                   | 番号      | `1`         | フォグ濃度を増減する。                        |
| skyTopColor [オプション］                                    | ヘックスカラー | BDC0D6\\`。 | ユーザーの真上にある空の色を設定する。                |
| skyBottomColor [オプション]。      | ヘックスカラー | 1A1C2A\\`。 | 地平線に空の色を設定する。                      |
| skyGradientStrength [オプション]。 | 番号      | `1`         | 空のグラデーションがどの程度シャープに変化するかをコントロールする。 |

注釈

- cameraConfig`：ワールドトラッキング（SLAM）は `back` カメラでのみサポートされる。  cameraConfig`：ワールドトラッキング（SLAM）は `back`カメラでのみサポートされる。  もし`front`カメラを使っている場合は、まず`XR8.XrController.configure({disableWorldTracking: true})\` を呼び出してワールドトラッキングを無効にする必要があります。

## {#returns}を返す。

なし

## 例 {#example}

```javascript
// カメラを開き、カメラ実行ループの実行を開始する
// index.html内： <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed')})
```

## 例 - フロントカメラの使用（画像トラッキングのみ） {#example---using-front-camera-image-tracking-only}

```javascript
// ワールドトラッキング（SLAM）を無効にします。これはフロントカメラを使用するために必要です。
XR8.XrController.configure({disableWorldTracking: true})
// カメラを開き、カメラランループの実行を開始する
// index.html 内： <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig：カメラ設定: {direction：XR8.XrConfig.camera().FRONT}})
```

## 例 - glContextConfig を設定する {#example---set-glcontextconfig}

```javascript
// カメラを開き、不透明なキャンバスでカメラの実行ループを開始します。
// index.htmlで <canvas id="camerafeed"></canvas>
XR8.run({canvas: document.getElementById('camerafeed'), glContextConfig： {alpha: false, preserveDrawingBuffer: false}})
```
