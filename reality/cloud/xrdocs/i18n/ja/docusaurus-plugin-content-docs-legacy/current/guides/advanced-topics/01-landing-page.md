---
id: landing-pages
---

# ランディングページ

ランディングページは、私たちの人気ページ「Almost There」を進化させたものです。

## なぜランディングページを使うのか？ なぜランディングページを使うのか？ {#why-use-landing-pages} なぜランディングページを使うのか？ {#why-use-landing-pages}

私たちは、これらのページをあなたのための強力なブランディングとマーケティングの機会に変身させ、
。 私たちは、これらのページをあなたのための強力なブランディングとマーケティングの機会に変身させ、
。 すべてのランディングページテンプレートは、様々な
レイアウト、改良されたQRコードデザイン、主要メディアのサポートにより、ブランディングと教育に最適化されています。

ランディングページは、ユーザーがどのようなデバイスを使用していても、有意義な体験を提供します。
ランディングページは、ユーザーがどのようなデバイスを使用していても、有意義な体験を提供します。
\- ウェブARエクスペリエンス
への直接アクセスが許可されていない、またはできないデバイスに表示されます。 また、ユーザーがARを利用するために適切な
。 また、ユーザーがARを利用するために適切な
。

私たちは、開発者が
ページを非常に簡単にカスタマイズできるようにランディングページをデザインしました。 私たちは、最適化されたランディングページの恩恵を受けながら、WebARエクスペリエンスの構築に
時間を費やすことができるようにしたいと考えています。 私たちは、開発者が
ページを非常に簡単にカスタマイズできるようにランディングページをデザインしました。 私たちは、最適化されたランディングページの恩恵を受けながら、WebARエクスペリエンスの構築に
時間を費やすことができるようにしたいと考えています。 私たちは、最適化されたランディングページの恩恵を受けながら、WebARエクスペリエンスの構築に
時間を費やすことができるようにしたいと考えています。

## ランディングページはお客様の設定にインテリジェントに適応する {#landing-pages-intelligently-adapt-to-your-configuration}

![loading-examples1](/images/landing-examples1.jpg)

![loading-examples2](/images/landing-examples2.jpg)

## プロジェクトでランディングページを使う {#use-landing-pages-in-your-project}

1. プロジェクトを開く
2. head.html\\`に以下のタグを追加する。

`<meta name="8thwall:package" content="@8thwall.landing-page">`

注：セルフ・ホスト・プロジェクトの場合は、代わりに以下の `<script>` タグをページに追加します：

<script src='https://cdn.8thwall.com/web/landing-page/landing-page.js'></script>`

3. \*\*A-Frame プロジェクトから `xrextras-almost-there` を削除するか、
   `XRExtras.AlmostThere.pipelineModule()` を非 A-Frame プロジェクトから削除してください。 (ランディングページには、QRコードページの更新に加え、
   、ほぼ実現可能なロジックが含まれている)。 (ランディングページには、QRコードページの更新に加え、
   、ほぼ実現可能なロジックが含まれている)。
4. オプションとして、`landing-page`コンポーネントのパラメーターを以下のようにカスタマイズする。 オプションとして、`landing-page`コンポーネントのパラメーターを以下のようにカスタマイズする。
   非AFrameプロジェクトについては、[LandingPage.configure()](/legacy/api/landingpage/configure)
   ドキュメントを参照してください。

## A-Frame コンポーネントのパラメータ（すべてオプション） {#a-frame-component-parameters}

| パラメータ          | タイプ     | デフォルト                                                        | 説明                                                                                                                                                                                                                                                                                                            |
| -------------- | ------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ロゴSrc          | 文字列     |                                                              | ブランドロゴのイメージソース。                                                                                                                                                                                                                                                                                               |
| ロゴ             | 文字列     | ロゴ                                                           | ブランドロゴ画像のオルトテキスト                                                                                                                                                                                                                                                                                              |
| プロンプト接頭辞       | 文字列     | スキャンまたは訪問                                                    | エクスペリエンスのURLが表示される前に、コールトゥアクションのテキスト文字列を設定します。                                                                                                                                                                                                                                                                |
| url            | 文字列     | 8th.ioのリンク（8th Wallがホスティングされている場合）、または現在のページ | 表示されるURLとQRコードを設定します。                                                                                                                                                                                                                                                                                         |
| プロンプトサフィックス    | 文字列     | 続ける                                                          | 体験のURLが表示された後のコールトゥアクションのテキスト文字列を設定します。                                                                                                                                                                                                                                                                       |
| テキストカラー        | ヘックスカラー | '#ffffff'\\`。                                               | ランディングページのすべてのテキストの色。                                                                                                                                                                                                                                                                                         |
| フォント           | 文字列     | Nunito', sans-serif"\\`。                                    | ランディングページのすべてのテキストのフォント。 ランディングページのすべてのテキストのフォント。 このパラメータは有効なCSS font-family引数を受け付ける。                                                                                                                                                                                                                         |
| テキストシャドウ       | ブーリアン   | false\\`                                                    | ランディングページのすべてのテキストにtext-shadowプロパティを設定します。                                                                                                                                                                                                                                                                    |
| 背景Src          | 文字列     |                                                              | 背景画像の画像ソース。                                                                                                                                                                                                                                                                                                   |
| 背景ぼかし          | 番号      | `0`                                                          | もし `backgroundSrc` が指定されていれば、それにぼかし効果を適用する。 (通常、値は0.0～1.0です） (通常、値は0.0～1.0です）                                                                                                                           |
| 背景色            | 文字列     | `'linear-gradient(#464766,#2D2E43)'`                         | ランディングページの背景色。 ランディングページの背景色。 このパラメータは有効な CSS background-color 引数を受け付ける。 background-srcまたはsceneEnvMapが設定されている場合、背景色は表示されません。 ランディングページの背景色。 ランディングページの背景色。 このパラメータは有効な CSS background-color 引数を受け付ける。 background-srcまたはsceneEnvMapが設定されている場合、背景色は表示されません。 background-srcまたはsceneEnvMapが設定されている場合、背景色は表示されません。 |
| メディアソース        | 文字列     | アプリのカバー画像（ある場合                                               | ランディングページのヒーローコンテンツのメディアソース（3Dモデル、画像、動画）。 受け入れ可能なメディア・ソースには、a-asset-item idまたは静的URLがある。 受け入れ可能なメディア・ソースには、a-asset-item idまたは静的URLがある。                                                                                                                                                                         |
| メディアアルト        | 文字列     | プレビュー                                                        | ランディングページの画像コンテンツのAltテキスト。                                                                                                                                                                                                                                                                                    |
| メディア自動再生       | ブーリアン   | true\\`                                                     | mediaSrc\\`がビデオの場合、ロード時にサウンドをミュートしてビデオを再生するかどうかを指定する。                                                                                                                                                                                                                                                        |
| メディアアニメーション    | 文字列     | モデルの最初のアニメーションクリップ（存在する場合                                    | mediaSrc\\`が3Dモデルの場合、そのモデルに関連付けられた特定のアニメーションクリップを再生するか、"none "を再生するかを指定する。                                                                                                                                                                                                                                   |
| メディアコントロール     | 文字列     | ミニマム                                                         | mediaSrc\\`がビデオの場合、ユーザーに表示するメディアコントロールを指定する。 none"、"mininal"、"browser"（ブラウザのデフォルト）から選択。 none"、"mininal"、"browser"（ブラウザのデフォルト）から選択。                                                                                                                                                                           |
| シーンエンビマップ      | 文字列     | フィールド                                                        | 等角画像を指す画像ソース。 または以下のプリセット環境のいずれか：「フィールド"、"丘"、"都市"、"パステル"、または "宇宙"。                                                                                                                                                                                                                                            |
| シーンオービットアイドル   | 文字列     | スピン                                                          | mediaSrc\\`が3Dモデルの場合、モデルを "spin "にするか、"none "にするかを指定する。                                                                                                                                                                                                                                                      |
| シーン軌道相互作用      | 文字列     | \`                                                           | mediaSrc\\`が3Dモデルの場合、ユーザーが軌道コントロールを操作できるかどうかを指定します。"drag "または "none "を選択します。                                                                                                                                                                                                                                 |
| シーン照明強度        | 番号      | `1`                                                          | mediaSrc\\`が3Dモデルの場合、モードを照らす光の強さを指定します。                                                                                                                                                                                                                                                                      |
| vrPromptPrefix | 文字列     | または訪問する                                                      | VRヘッドセットでエクスペリエンスのURLが表示される前に、コールトゥアクションのテキスト文字列を設定します。                                                                                                                                                                                                                                                       |

## 例 {#examples}

#### ユーザー指定パラメータによる3Dレイアウト {#3d-layout-with-user-specified-parameters}

![loading-example](/images/landingpage-example.jpg)

#### 外部 URL を使用した A フレームの例（上のスクリーンショット） {#a-frame-example}

```html
<a-scene
  landing-page="
    mediaSrc: https://www.mydomain.com/helmet.glb;
    sceneEnvMap: hill"
  xrextras-loading
  xrextras-gesture-detector
  ...
  xrweb>。
```

#### ローカル資産によるAフレームの例 {#a-frame-local-asset example}

```html
<a-scene
  xrextras-gesture-detector
  landing-page="mediaSrc：#myModel"
  xrextras-loading
  xrextras-runtime-error
  renderer="colorManagement: true"
  xrweb>

  <!-- We can define assets here to be loaded when A-Frame initializes -->
  <a-assets>
    <a-asset-item id="myModel" src="assets/my-model.glb"></a-asset-item>
  </a-assets>
```

#### 非AFrameの例（上のスクリーンショット） {#non-aframe-example--screenshot-above}

```js
// ここで設定
LandingPage.configure({
    mediaSrc: 'https://www.mydomain.com/bat.glb',
    sceneEnvMap：'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // ここに追加
  LandingPage.pipelineModule(),
  ...
])
```
