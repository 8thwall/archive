---
id: ios-8th-wall-web-inside-an-iframe
---

# iframeでの作業

## AndroidおよびiOS用iframeセットアップ 15+ {#iframe-setup-for-android-and-ios-15}

AndroidとiOS 15+でインラインARを許可するには、iframeに以下の[feature-policyディレクティブ](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)でallowパラメータを含める必要があります：

```html
<iframe allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"></iframe>
```

注：マイクはオプションです。

## LEGACY METHOD: iOS 15より前のiOSバージョンをサポート {#legacy-method-supporting-ios-versions-prior-to-ios-15}

以下は、iOS 15より前のiOSバージョンでインラインARをサポートするために**唯一**必要なものです。
iOS 15+の高い普及率を考えると、私たちはこの方法を使うことを**もはや**推奨しません。
iOS 15+の高い普及率を考えると、私たちはこの方法を使うことを**もはや**推奨しません。

アップルによる最新のiOS普及統計をご覧ください：<https://developer.apple.com/support/app-store/>

[feature-policy directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy#directives)
上記で説明したように、iframeに正しいallowパラメータを含めることに加えて、iOS
15より前のiOSバージョンでWorld Trackingプロジェクトをサポートするためには、以下に説明するように、OUTERとINNER ARページの両方に追加のjavascriptを含める必要があります
.

これらのバージョンでは、Safariはクロスオリジン
iframeからのdeviceorientationおよびdevicemotionイベントアクセスをブロックします。 この対策として、World Trackingプロジェクトのデプロイ時にiOSとのクロスコンパチビリティ（
）を確保するために、プロジェクトに2つのスクリプトを含める必要があります。 これらのバージョンでは、Safariはクロスオリジン
iframeからのdeviceorientationおよびdevicemotionイベントアクセスをブロックします。 この対策として、World Trackingプロジェクトのデプロイ時にiOSとのクロスコンパチビリティ（
）を確保するために、プロジェクトに2つのスクリプトを含める必要があります。 この対策として、World Trackingプロジェクトのデプロイ時にiOSとのクロスコンパチビリティ（
）を確保するために、プロジェクトに2つのスクリプトを含める必要があります。

Face EffectsやImage Targetプロジェクトでは**必要ありません**（`disableWorldTracking`を
`true`に設定している場合）。

このプロセスが正しく実装されていれば、OUTERのウェブサイトは、ワールドトラッキングの要件であるモーションイベントを
INNER ARウェブサイトに送信することができる。

#### OUTERウェブサイト {#for-the-outer-website}

**iframe.js**は、このスクリプト・タグを介して**OUTER**ページの**HEAD**に含める必要があります：

```html
<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>
```

AR起動時にiframe IDでXRIFrameを登録する：

```js
window.XRIFrame.registerXRIFrame(IFRAME_ID)
```

ARを停止する場合は、XRIFrameの登録を解除する：

```js
window.XRIFrame.deregisterXRIFrame()
```

#### インナーウェブサイトの場合 {#for-the-inner-website}

**iframe-inner.js**は、**INNER AR**ウェブサイトの**HEAD**に、このスクリプトタグと一緒に含める必要があります：

```html
<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
```

インナーウィンドウとアウターウィンドウが通信できるようにすることで、デバイスの向き／デバイスの動きのデータを共有することができる。

<https://www.8thwall.com/8thwall/inline-ar>のサンプルプロジェクトを参照。

#### 例 {#examples}

##### アウターページ {#outer-page}

```jsx

<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>

...
const IFRAME_ID = 'my-iframe' // ARコンテンツを含むIframe
const onLoad = () => {
  window.XRIFrame.registerXRIFrame(IFRAME_ID)
} // 本体のDOMにイベントリスナーを追加する。
//
window.addEventListener('load', onLoad, false)

...

<body>
  <iframe
    id="my-iframe"
    style="border：0; width: 100%; height: 100%"
    allow="camera;microphone;gyroscope;accelerometer;"
    src="https://www.other-domain.com/my-web-ar/">
  </iframe>
</body>
```

##### 内側のページAFrame projects {#inner-page-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<body>
  <!-- For A-FRAME -->
  <!-- NOTE: The iframe-inner script must load after A-FRAME, and iframe-inner component must appear
  before xrweb. -->
  <a-scene iframe-inner xrweb>
    . </a-scene> <a-scene iframe-inner xrweb>..
  </a-scene>
```

##### 内側のページノンAフレーム・プロジェクト {#inner-page-non-aframe-projects}

```html
<head>
  <!-- Recieve deviceorientation/devicemotion from the OUTER window -->
  <script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>
</head>

...

<!-- For non-AFrame projects, add iframeInnerPipelineModule to the custom pipeline module section,
typically located in "onxrloaded" like so: -->
XR8.addCameraPipelineModules([
  // カスタムパイプラインモジュール
  iframeInnerPipelineModule,
])
```
