# XR8.GlTextureRenderer

## 説明 {#description}

カメラフィードをキャンバスに描画するカメラパイプラインモジュールと、GL描画操作のための追加ユーティリティを提供します。

## 機能 {#functions}

| 機能                                                              | 説明                                                                                                                                                                                                             |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                                       | カメラフィードをキャンバスに描画するパイプラインモジュールを設定します。                                                                                                                                                                           |
| [create](create.md)                                             | テクスチャからキャンバスまたは別のテクスチャにレンダリングするためのオブジェクトを作成します。                                                                                                                                                                |
| [fillTextureViewport](filltextureviewport.md)                   | ソースからテクスチャまたはキャンバスを歪みなく塗りつぶすビューポート構造体を取得するための便利なメソッドです。 ソースからテクスチャまたはキャンバスを歪みなく塗りつぶすビューポート構造体を取得するための便利なメソッドです。 これは、[`XR8.GlTextureRenderer.create()`](create.md) によって生成されたオブジェクトの render メソッドに渡されます。          |
| [getGLctxParameters](getglctxparameters.md)                     | WebGLバインディングの現在のセットを取得し、後で復元できるようにする。                                                                                                                                                                          |
| [pipelineModule](pipelinemodule.md)                             | カメラフィードをキャンバスに描画するパイプラインモジュールを作成します。                                                                                                                                                                           |
| [setGLctxParameters](setglctxparameters.md)                     | XR8.GlTextureRenderer.getGLctxParameters()\\`](getglctxparameters.md)で保存したWebGLバインディングを復元します。 |
| [setTextureProvider](settextureprovider.md)                     | 描画するテクスチャを渡すプロバイダを設定します。                                                                                                                                                                                       |
| [setForegroundTextureProvider](setforegroundtextureprovider.md) | 描画する前景テクスチャとアルファマスクのリストを渡すプロバイダを設定する。                                                                                                                                                                          |
