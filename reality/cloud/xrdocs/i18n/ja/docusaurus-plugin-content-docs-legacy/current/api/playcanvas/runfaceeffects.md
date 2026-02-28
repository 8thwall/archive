---
sidebar_label: runFaceEffects() (非推奨)
---

# XR8.PlayCanvas.runFaceEffects() (廃止予定)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )` \\`.

## 説明 {#description}

カメラを開き、PlayCanvas シーン内で XR World Tracking または Image Targets の実行を開始します。

## パラメータ {#parameters}

| パラメータ                                          | 説明                                                                                                                              |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| pcCamera                                       | ARでドライブするPlayCanvasシーンカメラ。                                                                                                      |
| pcApp                                          | PlayCanvas アプリ、通常は `this.app`。                                                                                                  |
| extraModules [オプション］ | インストールする追加パイプラインモジュールの配列（オプション）。                                                                                                |
| コンフィグ                                          | XR8.run()\\`](/legacy/api/xr8/run) に渡す設定パラメータ。 |

config\\`は以下のプロパティを持つオブジェクトである：

| プロパティ                                                                        | タイプ                                                                                                | デフォルト                                                                                                | 説明                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| キャンバス                                                                        | [HTMLCanvasElement\\`](https://developer.mozilla.org/en-US/docs/Web/legacy/api/HTMLCanvasElement) |                                                                                                      | カメラフィードが描画されるHTMLキャンバス。 通常、これは「application-canvas」である。 カメラフィードが描画されるHTMLキャンバス。 通常、これは「application-canvas」である。 通常、これは「application-canvas」である。                                                                    |
| webgl2 [オプション］                                     | ブーリアン                                                                                              | false\\`                                                                                            | trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  false の場合、常に WebGL1 を使用します。 |
| ownRunLoop [オプション］                                 | ブーリアン                                                                                              | false\\`                                                                                            | もしtrueなら、XRはそれ自身のランループを使うはずだ。  もしtrueなら、XRはそれ自身のランループを使うはずだ。  falseの場合、実行ループを自分で用意し、[`XR8.runPreRender()`](/legacy/api/xr8/runprerender)と[`XR8.runPostRender()`](/legacy/api/xr8/runpostrender)を自分で呼び出す必要があります。 |
| cameraConfig： {direction} [オプション］                  | オブジェクト                                                                                             | `{direction：XR8.XrConfig.camera().BACK}`。                                                            | 使用したいカメラ 使用したいカメラ 使用可能な`direction`の値は`XR8.XrConfig.camera().BACK`または`XR8.XrConfig.camera().FRONT`です。                                                                                                            |
| glContextConfig [オプション]。 | WebGLContextAttributes\\`。                                                                        | null\\`。                                                                                            | WebGL canvas コンテキストを設定する属性。                                                                                                                                                                                     |
| allowedDevices [オプション］                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                             | XR8.XrConfig.device().MOBILE\\`。 | パイプラインを実行するデバイスのクラスを指定する。  現在のデバイスがそのクラスでない場合、カメラを開く前に実行が失敗します。 allowedDevicesが`XR8.XrConfig.device().ANY`の場合、常にカメラを開きます。 ワールドトラッキングは`XR8.XrConfig.device().MOBILE`でのみ使用できることに注意してください。                         |

## {#returns}を返す。

なし
