---
sidebar_label: fillTextureViewport()
---

# XR8.GlTextureRenderer.fillTextureViewport()

`XR8.GlTextureRenderer.fillTextureViewport(srcWidth, srcHeight, destWidth, destHeight)`.

## 説明 {#description}

ソース
から、テクスチャまたはキャンバスを歪みなく塗りつぶすビューポート構造体を取得するための便利なメソッドです。 ソース
から、テクスチャまたはキャンバスを歪みなく塗りつぶすビューポート構造体を取得するための便利なメソッドです。 これは、
[`XR8.GlTextureRenderer.create()`](create.md) によって生成されたオブジェクトのrenderメソッドに渡されます。

## パラメータ {#parameters}

| パラメータ     | タイプ | 説明                |
| --------- | --- | ----------------- |
| src幅      | 番号  | レンダリングするテクスチャの幅。  |
| srcHeight | 番号  | レンダリングするテクスチャの高さ。 |
| デスト幅      | 番号  | レンダーターゲットの幅。      |
| デストハイト    | 番号  | レンダーターゲットの高さ。     |

## {#returns}を返す。

オブジェクト: `{ width, height, offsetX, offsetY }`.

| プロパティ     | タイプ | 説明                   |
| --------- | --- | -------------------- |
| 幅         | 番号  | 描画する幅（ピクセル単位）。       |
| 高さ        | 番号  | 描画する高さ（ピクセル単位）。      |
| オフセットエックス | 番号  | 描画するx座標の最小値（ピクセル単位）。 |
| オフセットY    | 番号  | 描画するy座標の最小値（ピクセル単位）。 |
