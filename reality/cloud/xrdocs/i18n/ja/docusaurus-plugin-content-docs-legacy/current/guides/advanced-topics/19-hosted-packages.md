---
id: hosted-packages
---

# ホスティングパッケージ

## メタタグ {#meta-tags}

8th Wall `<meta>`タグを使用して、一般的なレンダラーやパッケージをクラウドエディタープロジェクトに素早くロードします。

name`属性で`renderer`と`package` のどちらを読み込むかを指定し、`content\\` 属性でどのレンダラー/パッケージを読み込むかを指定する：

```
<meta name="8thwall:renderer" content="renderer:version">
<meta name="8thwall:package" content="@package.package">
```

### レンダラ {#renderers}

`<meta name="8thwall:renderer" ...>`タグを使って、A-Frame、three.js、またはBabylon.jsをクラウドエディタプロジェクトに読み込むことができます：

```
<meta name="8thwall:renderer" content="aframe:version">
<meta name="8thwall:renderer" content="threejs:version">
<meta name="8thwall:renderer" content="babylonjs:version">
```

#### aframe {#aframe}

A-Frame の特定のバージョンのみが、`<meta>` タグを介してサポートされています。 これは、8th WallがA-Frameのカスタムバージョンを使用しているためで、ARをよりよくサポートするためにさまざまな改良が加えられている。 これは、8th WallがA-Frameのカスタムバージョンを使用しているためで、ARをよりよくサポートするためにさまざまな改良が加えられている。

- `0.8.2`
- `0.9.0`
- `0.9.2`
- `1.0.3`
- `1.0.4`
- `1.1.0`
- `1.2.0`
- `1.3.0`
- `1.4.1`
- `1.5.0`

##### 例 {#example}

```
<meta name="8thwall:renderer" content="aframe:1.5.0">
```

#### threejs {#threejs}

すべてのバージョンのthree.jsは、`<meta>`タグを介してサポートされています。

three.js 160+では、`<meta>`タグの代わりにimport mapsを使う必要がある。 例は[こちら](https://www.8thwall.com/8thwall/placeground-threejs/code/head.html#L8)を参照。 例は[こちら](https://www.8thwall.com/8thwall/placeground-threejs/code/head.html#L8)を参照。

##### 例 {#example-1}

```
<meta name="8thwall:renderer" content="threejs:159">
```

### パッケージ {#packages}

`<meta name="8thwall:package" ...>`タグを使用して、一般的なパッケージをクラウドエディタプロジェクトに読み込むことができます：

| パッケージ                                                                                        | コンテンツ価値                                           |
| -------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [XRExtras](https://github.com/8thwall/web/tree/master/xrextras)                              | 8thwall.xrextras\\`。             |
| [ランディングページ](https://www.8thwall.com/docs/legacy/guides/advanced-topics/landing-pages)        | 8thwall.landing-page\\`。         |
| [コーチング・オーバーレイ](https://www.8thwall.com/docs/legacy/guides/advanced-topics/coaching-overlays) | 8thwall.coaching-overlay\\`。     |
| [ビュー](https://www.npmjs.com/package/vue)                                                     | vuejs.vue\\`。                    |
| [HoloVideoObject](https://www.8thwall.com/8thwall/mrcs-aframe)                               | mrcs.holovideoobject\\`。         |
| [リアクト](https://www.npmjs.com/package/react)                                                  | `@react.react`                                    |
| [リアクトDOM](https://www.npmjs.com/package/react-dom)                                           | `@react.react-dom`                                |
| [リアクト・ルーター DOM](https://www.npmjs.com/package/react-router-dom)                              | react.react-router-dom\\`。       |
| [A-Frame Extras](https://www.npmjs.com/package/aframe-extras)                                | aframe.aframe-extras\\`。         |
| [Aフレーム物理システム](https://www.npmjs.com/package/aframe-physics-system)                           | aframe.aframe-physics-system\\`。 |

#### 例 {#example-2}

```
<meta name="8thwall:package" content="@8thwall.xrextras">
```

上記の`<meta>`タグはすべて公式CDN URLを評価する。 彼らは、サポートされている最新バージョンのパッケージを引っ張ってくる。 特定のバージョンを使用したい場合は、代わりに `<script>` タグを使用してください。

## 8番目の壁 CDN {#8th-wall-cdn}

8th Wallは、利便性のために特定のバージョンに固定された様々なパッケージをCDN上でホストしています。

#### ammo {#ammo}

- `https://cdn.8thwall.com/web/aframe/ammo.wasm.js`
- `https://cdn.8thwall.com/web/aframe/ammo.wasm.wasm`

#### aframe-physics-system {#aframe-physics-system}

- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-3.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.0.1-updated.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-physics-system-4.2.2.min.js`

#### aframe-animation-component {#aframe-animation-component}

- `https://cdn.8thwall.com/web/aframe/aframe-animation-component-5.1.2.min.js`

#### アフレーム・クロマキー素材 {#aframe-chromakey-material}

- `https://cdn.8thwall.com/web/aframe/aframe-chromakey-material-1.1.1.min.js`

#### アフレコ・エキストラ {#aframe-extras}

- `https://cdn.8thwall.com/web/aframe/aframe-extras-4.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-6.1.1.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-extras-7.2.0.min.js`

#### aframe-particle-system-component {#aframe-particle-system-component}

- `https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.3.min.js`
- `https://cdn.8thwall.com/web/aframe/aframe-particle-system-component-1.1.4.min.js`

#### aframe-spe-particles-component {#aframe-spe-particles-component}

- `https://cdn.8thwall.com/web/aframe/aframe-spe-particles-component.min.js`

#### デプスキット {#depthkit}

- `https://cdn.8thwall.com/web/aframe/depthkit-1.0.0.min.js`

#### holovideoobject {#holovideoobject}

- `https://cdn.8thwall.com/web/mrcs/holovideoobject-0.2.2.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.2.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.3.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.2.5.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.1.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.2.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.3.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.4.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.6.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.3.7.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.4.0.min.js`
- `https://cdn.8thwall.com/web/mrcs/holovideoobject-1.5.0.min.js`

## 特定のエンジンチャンクのロード

エンドユーザーのダウンロードサイズを最小化するために、以下の方法を使用して必要なエンジン機能のみを選択的にロードすることができます。

### クラウド・エディター

どのチャンクをプリロードするかは、`head.html`に以下のメタタグを追加することで指定できる。

- 使用可能なチャンク：'slam', 'hand', 'face'.

```html
<meta name="8thwall:preloadChunks" content="slam,hand,face" />
```

### セルフサービス

あるいは、以下のスクリプト・タグを追加して、必要なチャンクを定義することもできる：

- 受け入れられるチャンクは「スラム」「ハンド」「フェース」。

```html
<script>window._XR8Chunks = ['スラム']です。 </script>
```
