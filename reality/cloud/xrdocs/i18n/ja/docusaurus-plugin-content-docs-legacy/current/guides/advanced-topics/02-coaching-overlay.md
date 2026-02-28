---
id: coaching-overlays
---

# コーチング・オーバーレイ

コーチング・オーバーレイは、ユーザーをオンボードにし、最高の体験を保証します。

## Absolute Scale Coaching Overlay {#absolute-scale-coaching-overlay}

アブソリュート・スケール・コーチング・オーバーレイは、
、スケールを決定するために可能な限り最良のデータを収集できるよう、絶対スケールを体験できるようユーザーを指導する。 コーチングオーバーレイは、開発者が簡単に
カスタマイズできるように設計されており、WebAR体験の構築に時間を集中することができます。

### プロジェクトでアブソリュート・スケール・コーチング・オーバーレイを使用する： {#use-absolute-scale-coaching-overlay-in-your-project}

1. プロジェクトを開く
2. head.html\\`に以下のタグを追加する。

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

注：セルフ・ホスト・プロジェクトの場合は、代わりに以下の `<script>` タグをページに追加します：

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. オプションとして、`coaching-overlay`コンポーネントのパラメーターを以下のようにカスタマイズしてください。 オプションとして、`coaching-overlay`コンポーネントのパラメーターを以下のようにカスタマイズしてください。
   非 AFrame プロジェクトについては、
   [CoachingOverlay.configure()](/legacy/api/coachingoverlay/configure) のドキュメントを参照してください。

### A-Frame コンポーネントのパラメータ（すべてオプション） {#absolute-scale-coaching-overlay-parameters}

| パラメータ        | タイプ   | デフォルト       | 説明                                                                                                                                     |
| ------------ | ----- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| アニメーションカラー   | 文字列   | 白           | Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。 |
| プロンプトカラー     | 文字列   | 白           | すべてのコーチング・オーバーレイ・テキストの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。                                                         |
| プロンプトテキスト    | 文字列   | デバイスを前後に動かす | スケールを生成するために必要なモーションをユーザーに知らせるアニメーション説明テキストのテキスト文字列を設定します。                                                                             |
| ディスエーブルプロンプト | ブーリアン | false\\`   | カスタムオーバーレイにコーチングオーバーレイイベントを使用するために、デフォルトのコーチングオーバーレイを非表示にするにはtrueを設定します。                                                               |

### プロジェクト用にカスタムコーチングオーバーレイを作成する {#custom-absolute-scale-coaching-overlay}

コーチングオーバーレイはパイプラインモジュールとして追加することができ、その後非表示にすることができます（`disablePrompt`
パラメータを使用）ので、簡単にコーチングオーバーレイイベントを使用してカスタムオーバーレイをトリガーすることができます。

Coaching Overlay イベントは `scale` が `absolute` に設定されているときのみ発生します。 イベントは、
8th Wall カメラの実行ループから発信され、パイプライン・モジュール内からリッスンできます。  これらのイベント
： イベントは、
8th Wall カメラの実行ループから発信され、パイプライン・モジュール内からリッスンできます。  これらのイベント
：

- coaching-overlay.show\\`: コーチングオーバーレイが表示されたときに発生するイベントです。
- coaching-overlay.hide\\`: コーチングオーバーレイが非表示になった時に発生するイベントです。

#### 例 - ユーザー指定のパラメーターによるコーチング・オーバーレイ {#example---coaching-overlay-with-user-specified-parameters}

![coachingoverlay-example](/images/coachingoverlay-example.jpg)

#### Aフレームの例（上のスクリーンショット） {#a-frame-example-screenshot-above}

```jsx
<a-scene
  coaching-overlay="
    animationColor：#E86FFF;
    promptText：スケールを生成するには、携帯電話を前に押してから後ろに引いてください。"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="scale: absolute;">
```

#### 非AFrameの例（上のスクリーンショット） {#non-aframe-example--screenshot-above}

```jsx
// ここで設定
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText：'To generate scale push your phone forward and then pull back',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // ここに追加
  CoachingOverlay.pipelineModule(),
  ...
])
```

#### AFrame の例 - コーチング・オーバーレイ・イベントのリスニング {#aframe-example---listening-for-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('coaching-overlay.show', () => {
  // 何かをする
 })

this.el.sceneEl.addEventListener('coaching-overlay.hide', () => {
  // 何かをする
})
```

#### 非AFrameの例 - コーチング・オーバーレイ・イベントのリスニング {#non-aframe-example---listening-for-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-coaching-overlay',
  listeners：[
    {event: 'coaching-overlay.show', process: myShow},
    {event: 'coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## VPS コーチング・オーバーレイ {#vps-coaching-overlay}

VPSコーチング・オーバーレイは、ユーザーをVPS体験にオンボードし、実世界の場所で適切に
ローカライズすることを保証する。 コーチング・オーバーレイは、
開発者が簡単にカスタマイズできるように設計されており、WebAR体験の構築に時間を集中することができます。 コーチング・オーバーレイは、
開発者が簡単にカスタマイズできるように設計されており、WebAR体験の構築に時間を集中することができます。

### あなたのプロジェクトでVPSコーチング・オーバーレイを使おう： {#use-vps-coaching-overlay-in-your-project}

1. プロジェクトを開く
2. head.html\\`に以下のタグを追加する。

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

注：セルフ・ホスト・プロジェクトの場合は、代わりに以下の `<script>` タグをページに追加します：

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. オプションとして、`coaching-overlay`コンポーネントのパラメーターを以下のようにカスタマイズしてください。  オプションとして、`coaching-overlay`コンポーネントのパラメーターを以下のようにカスタマイズしてください。\
   非AFrameプロジェクトについては、
   [VpsCoachingOverlay.configure()](/legacy/api/vpscoachingoverlay/vps-coachingoverlay-configure) のドキュメントを参照してください。

### A-Frame コンポーネントのパラメータ（すべてオプション） {#vps-coaching-overlay-parameters}

| パラメータ       | タイプ   | デフォルト                                                   | 説明                                                                                                                                                                                                                                  |
| ----------- | ----- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ウェイスポット名    | 文字列   |                                                         | コーチングオーバーレイがユーザーにローカライズを案内する場所の名前。 コーチングオーバーレイがユーザーにローカライズを案内する場所の名前。 Location名が指定されていない場合、最も近いProject Locationが使用されます。 プロジェクトにプロジェクトロケーションがない場合は、最も近いロケーションを使用します。 プロジェクトにプロジェクトロケーションがない場合は、最も近いロケーションを使用します。                     |
| ヒント画像       | 文字列   |                                                         | ユーザーに表示される画像で、実際の場所を案内する。 ユーザーに表示される画像で、実際の場所を案内する。 hint-imageが指定されない場合は、Locationのデフォルト画像が使用されます。 ロケーションにデフォルト画像がない場合、画像は表示されません。 使用可能なメディア・ソースは、img idまたは静的URLです。 ロケーションにデフォルト画像がない場合、画像は表示されません。 使用可能なメディア・ソースは、img idまたは静的URLです。 |
| アニメカラー      | 文字列   | '#ffffff'\\`。                                          | Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。                                                                                              |
| アニメーション時間   | 番号    | `5000`                                                  | ヒント画像が縮小表示されるまでの合計時間（ミリ秒）。                                                                                                                                                                                                          |
| プロンプトカラー    | 文字列   | '#ffffff'\\`。                                          | すべてのコーチング・オーバーレイ・テキストの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。                                                                                                                                                      |
| プロンプト接頭辞    | 文字列   | カメラを向ける                                                 | ロケーション名の上にある、アドバイスされたユーザーアクションのテキスト文字列を設定します。                                                                                                                                                                                       |
| プロンプト接尾辞    | 文字列   | そして動き回る                                                 | ロケーション名の下にある、アドバイスされたユーザーアクションのテキスト文字列を設定します。                                                                                                                                                                                       |
| ステータステキスト   | 文字列   | スキャン... | ヒント画像が縮小状態のときに、その下に表示されるテキスト文字列を設定します。                                                                                                                                                                                              |
| ディスアブルプロンプト | ブーリアン | false\\`                                               | カスタムオーバーレイにコーチングオーバーレイイベントを使用するために、デフォルトのコーチングオーバーレイを非表示にするにはtrueを設定します。                                                                                                                                                            |

### プロジェクト用にカスタムコーチングオーバーレイを作成する {#custom-vps-coaching-overlay}

コーチングオーバーレイはパイプラインモジュールとして追加することができ、その後非表示にすることができます（`disablePrompt`
パラメータを使用）ので、簡単にコーチングオーバーレイイベントを使用してカスタムオーバーレイをトリガーすることができます。

VPS Coaching Overlay イベントは `enableVps` が `true` に設定されているときのみ発生します。 イベントは8th Wallカメラの実行ループから
、パイプライン・モジュール内で聞くことができます。  これらの
： イベントは8th Wallカメラの実行ループから
、パイプライン・モジュール内で聞くことができます。  これらの
：

- `vps-coaching-overlay.show`: コーチングオーバーレイが表示されるときにイベントが発生します。
- `vps-coaching-overlay.hide`: コーチングオーバーレイが非表示になった時に発生するイベントです。

#### 例 - ユーザー指定のパラメーターによるコーチング・オーバーレイ {#example---coaching-overlay-with-user-specified-parameters}

![vps-coachingoverlay-example](/images/vps-coaching-overlay-example.jpg)

#### Aフレームの例（上のスクリーンショット） {#a-frame-example-screenshot-above}

```html
<a-scene
  vps-coaching-overlay="
    prompt-color：#0000FF;
    prompt-prefix：探しに行く;"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb="vpsEnabled: true;">
```

#### 非AFrameの例（上のスクリーンショット） {#non-aframe-example--screenshot-above}

```javascript
// Configured here
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // ここに追加
  VpsCoachingOverlay.pipelineModule(),
  ...
])

```

#### AFrame の例 - VPS コーチング・オーバーレイ・イベントのリスニング {#aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('vps-coaching-overlay.show', () => {
  // 何かをする
 })

this.el.sceneEl.addEventListener('vps-coaching-overlay.hide', () => {
  // 何かをする
})
```

#### 非AFrameの例 - VPSコーチング・オーバーレイ・イベントのリスニング {#non-aframe-example---listening-for-vps-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: VPS COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: VPS COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-coaching-overlay',
  listeners：[
    {event: 'vps-coaching-overlay.show', process: myShow},
    {event: 'vps-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## スカイエフェクト コーチング オーバーレイ {#sky-effects-coaching-overlay}

スカイ・エフェクツ・コーチング・オーバーレイは、ユーザーが
、デバイスを空に向けていることを確認し、スカイ・エフェクツ体験に誘う。 私たちは、開発者が簡単にカスタマイズできるようにコーチングオーバーレイを設計しました。
、WebAR体験の構築に時間を集中することができます。

**注：スカイエフェクトは現在、
[Simulator](/legacy/getting-started/quick-start-guide/#simulator).** ではプレビューできません。

### プロジェクトでスカイ・エフェクト・コーチングのオーバーレイを使う {#use-sky-effects-coaching-overlay-in-your-project}

1. プロジェクトを開く
2. head.html\\`に以下のタグを追加する。

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

注：セルフ・ホスト・プロジェクトの場合は、代わりに以下の `<script>` タグをページに追加します：

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. オプションとして、`sky-coaching-overlay`コンポーネントのパラメータを以下の定義に従ってカスタマイズしてください。
   AFrame以外のプロジェクトについては、以下を参照してください。
   AFrame以外のプロジェクトについては、SkyCoachingOverlay.configure()のドキュメントを参照してください。

### A-Frame コンポーネントのパラメータ（すべてオプション） {#sky-coaching-overlay-parameters}

| パラメータ        | タイプ   | デフォルト                | 説明                                                                                                                                     |
| ------------ | ----- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| アニメーションカラー   | 文字列   | 白                    | Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。 |
| プロンプトカラー     | 文字列   | 白                    | すべてのコーチング・オーバーレイ・テキストの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。                                                         |
| プロンプトテキスト    | 文字列   | 携帯電話を空に向けてください。      | ユーザーに必要な動きを知らせるアニメーションの説明テキストの文字列を設定します。                                                                                               |
| ディスエーブルプロンプト | ブーリアン | false\\`            | カスタムオーバーレイにコーチングオーバーレイイベントを使用するために、デフォルトのコーチングオーバーレイを非表示にするにはtrueを設定します。                                                               |
| 自動しきい値       | ブーリアン | true\\`             | 空のピクセルの割合が `hideThreshold` / `showThreshold` 以上/以下である場合に、自動的にオーバーレイを表示/非表示する。                                                          |
| しきい値         | 番号    | 0.1  | スカイピクセルのパーセンテージがこの閾値以下の場合、現在非表示のオーバーレイを表示する。                                                                                           |
| しきい値を隠す      | 番号    | 0.05 | 空のピクセルのパーセンテージがこのしきい値を超えている場合、現在表示されているオーバーレイを非表示にする。                                                                                  |

### プロジェクト用にカスタムコーチングオーバーレイを作成する {#custom-sky-coaching-overlay}

スカイコーチングオーバーレイは、パイプラインモジュールとして追加し、非表示にすることができます（`disablePrompt`パラメータを使用）。

- `sky-coaching-overlay.show`: コーチングオーバーレイが表示されるときにイベントが発生します。
- `sky-coaching-overlay.hide`: コーチングオーバーレイを非表示にするときに発生するイベントです。

**SkyCoachingOverlay.control**。

デフォルトでは、スカイエフェクトのコーチングオーバーレイは、ユーザーが空を見ているかどうかに応じて、自動的に表示/非表示を切り替えます。 SkyCoachingOverlay.control\`を使用することで、この動作を制御することができます。 SkyCoachingOverlay.control`を使用することで、この動作を制御することができます。

```javascript
//
SkyCoachingOverlay.control.show()
// コーチングオーバーレイを隠す
SkyCoachingOverlay.control.hide()
// 空のコーチングオーバーレイが自動的に表示/非表示になるようにします。
SkyCoachingOverlay.control.setAutoShowHide(true)
// 空のコーチングオーバーレイが自動的に表示/非表示にならないようにします。
SkyCoachingOverlay.control.setAutoShowHide(false)
// コーチングオーバーレイを非表示にし、クリーンアップする
SkyCoachingOverlay.control.cleanup()
```

例えば、体験の一部で、ユーザーが空を見る必要がなくなるかもしれない。 例えば、体験の一部で、ユーザーが空を見る必要がなくなるかもしれない。 setAutoShowHide(false)`を呼び出さないと、コーチングのオーバーレイがUIの上に表示されます。 この場合、`setAutoShowHide(false)`を呼び出し、手動で`show()`と`hide()` を使って表示と非表示をコントロールする。 また、ユーザーにもう一度空を見てもらうときは、`setAutoShowHide(true)\`とする。 この場合、`setAutoShowHide(false)`を呼び出し、手動で`show()`と`hide()` を使って表示と非表示をコントロールする。 また、ユーザーにもう一度空を見てもらうときは、`setAutoShowHide(true)\`とする。

#### 例 - ユーザー指定のパラメーターによるスカイ・コーチング・オーバーレイ {#example---sky-coaching-overlay-with-user-specified-parameters}

![sky-coachingoverlay-example](/images/sky-coachingoverlay-example.jpg)

#### Aフレームの例（上のスクリーンショット） {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrlayers="cameraDirection: back;"
  sky-coaching-overlay="
    animationColor：#E86FFF;
    promptText：空を見て!;"
  ...
  renderer="colorManagement: true"
>
```

#### 非AFrameの例（上のスクリーンショット） {#non-aframe-example--screenshot-above}

```javascript
// ここで設定
SkyCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: '空を見て!',
})
XR8.addCameraPipelineModules([ // カメラパイプラインモジュールを追加します。
    // 既存のパイプラインモジュール。
    XR8.GlTextureRenderer.pipelineModule(), // カメラフィードを描画します。
    XR8.Threejs.pipelineModule(), // Skyシーンと同様に、ThreeJS ARシーンを作成します。
    window.LandingPage.pipelineModule(), // サポートされていないブラウザを検出し、ヒントを与えます。
    XRExtras.FullWindowCanvas.pipelineModule(), // キャンバスをウィンドウいっぱいに変更します。
    XRExtras.Loading.pipelineModule(), // 起動時のローディング画面を管理します。
    XRExtras.RuntimeError.pipelineModule(), // ランタイムエラー時にエラー画像を表示します。

    // Sky Segmentationを有効にする。
    XR8.LayersController.pipelineModule(),
    SkyCoachingOverlay.pipelineModule(),

    ...
    mySkySampleScenePipelineModule(),
  ])

  XR8.LayersController.configure({layers: {sky: {invertLayerMask: false}}})
  XR8.Threejs.configure({layerScenes: ['sky']})

```

#### AFrameの例 - スカイコーチングのオーバーレイイベントを聴く {#aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('sky-coaching-overlay.show', () => {
  // 何かをする
 })

this.el.sceneEl.addEventListener('sky-coaching-overlay.hide', () => {
  // 何かをする
})
```

#### 非AFrameの例 - スカイコーチング・オーバーレイ・イベントのリスニング {#non-aframe-example---listening-for-sky-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: SKY COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: SKY COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-sky-coaching-overlay',
  listeners：[
    {event: 'sky-coaching-overlay.show', process: myShow},
    {event: 'sky-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```

## ハンドトラッキング コーチング オーバーレイ {#hand-tracking-coaching-overlay}

ハンド・トラッキング・コーチング・オーバーレイは、ユーザーが
、携帯電話を手に向けていることを確認し、ハンド・トラッキングを体験できるようにする。 私たちは、開発者が簡単にカスタマイズできるようにコーチングオーバーレイを設計しました。
、WebAR体験の構築に時間を集中することができます。

### ハンド・トラッキング・コーチングのオーバーレイをプロジェクトで使用する {#use-hand-tracking-coaching-overlay-in-your-project}

1. プロジェクトを開く
2. head.html\\`に以下のタグを追加する。

```jsx
<meta name="8thwall:package" content="@8thwall.coaching-overlay">
```

注：セルフ・ホスト・プロジェクトの場合は、代わりに以下の `<script>` タグをページに追加します：

```jsx
<script src='https://cdn.8thwall.com/web/coaching-overlay/coaching-overlay.js'></script>
```

3. オプションとして、`hand-coaching-overlay`コンポーネントのパラメータを以下の定義に従ってカスタマイズしてください。
   AFrame以外のプロジェクトについては、以下を参照してください。
   非AFrameプロジェクトについては、HandCoachingOverlay.configure()のドキュメントを参照してください。

### A-Frame コンポーネントのパラメータ（すべてオプション） {#hand-coaching-overlay-parameters}

| パラメータ        | タイプ   | デフォルト           | 説明                                                                                                                                     |
| ------------ | ----- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| アニメーションカラー   | 文字列   | 白               | Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 Coaching Overlayアニメーションの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。 |
| プロンプトカラー     | 文字列   | 白               | すべてのコーチング・オーバーレイ・テキストの色。 このパラメータは有効なCSSカラー引数を受け付ける。 このパラメータは有効なCSSカラー引数を受け付ける。                                                         |
| プロンプトテキスト    | 文字列   | 携帯電話を手に向けてください。 | ユーザーに必要な動きを知らせるアニメーションの説明テキストの文字列を設定します。                                                                                               |
| ディスエーブルプロンプト | ブーリアン | false\\`       | カスタムオーバーレイにコーチングオーバーレイイベントを使用するために、デフォルトのコーチングオーバーレイを非表示にするにはtrueを設定します。                                                               |

### プロジェクト用にカスタムコーチングオーバーレイを作成する {#custom-hand-coaching-overlay}

ハンドコーチングオーバーレイはパイプラインモジュールとして追加することができ、その後非表示にすることができます（`disablePrompt`パラメータを使用）。

- hand-coaching-overlay.show\\`: コーチングオーバーレイが表示される時にイベントが発生します。
- `hand-coaching-overlay.hide`: コーチングオーバーレイが非表示になった時に発生するイベントです。

#### 例 - ユーザー指定のパラメーターによるハンド・コーチング・オーバーレイ {#example---hand-coaching-overlay-with-user-specified-parameters}

![hand-coachingoverlay-example](/images/hand-coaching-overlay-example.jpeg)

#### Aフレームの例（上のスクリーンショット） {#a-frame-example-screenshot-above}

```html
<a-scene
  ...
  xrhand="allowedDevices:any; cameraDirection:back;"
  hand-coaching-overlay="
    animationColor：#
    promptText：スマホを左手に向けなさい!;"
  ...
  renderer="colorManagement: true"
>.
```

#### 非AFrameの例（上のスクリーンショット） {#non-aframe-example--screenshot-above}

```javascript
// ここで設定
HandCoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText：'Point the phone at your left hand!',
})
XR8.addCameraPipelineModules([ // カメラパイプラインモジュールを追加します。
    // 既存のパイプラインモジュール。
    XR8.GlTextureRenderer.pipelineModule(), // カメラフィードを描画します。
    XR8.Threejs.pipelineModule(), // Skyシーンと同様に、ThreeJS ARシーンを作成します。
    window.LandingPage.pipelineModule(), // サポートされていないブラウザを検出し、ヒントを与えます。
    XRExtras.FullWindowCanvas.pipelineModule(), // キャンバスをウィンドウいっぱいに変更します。
    XRExtras.Loading.pipelineModule(), // 起動時のローディング画面を管理します。
    XRExtras.RuntimeError.pipelineModule(), // ランタイムエラー時にエラー画像を表示します。

    // ハンドトラッキングを有効にする。
    XR8.HandController.pipelineModule(),
    HandCoachingOverlay.pipelineModule(),

    ...
    myHandSampleScenePipelineModule(),
  ])

```

#### AFrameの例 - ハンドコーチングのオーバーレイイベントを聴く {#aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
this.el.sceneEl.addEventListener('hand-coaching-overlay.show', () => {
  // 何かをする
 })

this.el.sceneEl.addEventListener('hand-coaching-overlay.hide', () => {
  // 何かをする
})
```

#### 非AFrameの例 - ハンドコーチングのオーバーレイイベントを聴く {#non-aframe-example---listening-for-hand-coaching-overlay-events}

```javascript
const myShow = () => {
  console.log('EXAMPLE: HAND COACHING OVERLAY - SHOW')
}

const myHide = () => {
  console.log('EXAMPLE: HAND COACHING OVERLAY - HIDE')
}

const myPipelineModule = {
  name: 'my-hand-coaching-overlay',
  listeners：[
    {event: 'hand-coaching-overlay.show', process: myShow},
    {event: 'hand-coaching-overlay.hide', process: myHide},
  ],
}

const onxrloaded = () => {
  XR8.addCameraPipelineModule(myPipelineModule)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
