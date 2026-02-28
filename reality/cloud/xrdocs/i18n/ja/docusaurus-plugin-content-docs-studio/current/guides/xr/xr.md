# エックスアール

8th Wallのワールドトラッキングとフェイスエフェクトは、Studio内で視覚的に使用することができます。 画像
ターゲット、スカイセグメンテーション、VPS、ハンドトラッキングは近日公開予定。

スタジオには3種類のカメラがあります：3Dのみ、フェイス、ワールドです。 これらのカメラタイプ
、それぞれ設定が異なります。 AR体験にはフェイスカメラまたはワールドカメラが必要です。 シーン内でのカメラの作成と管理について、詳しくは
[Camera](/studio/guides/camera)
セクションをご覧ください。

Studioには、プロジェクトでXRを使用するためのツールが用意されています。 World Effectsを使用するために、Studio
、6DoFカメラトラッキングとトラッキングを設定するためのインターフェイスを提供します。 Face Effectsでは、Studio
がFace Meshコンポーネントを提供し、エフェクトの設定やテスト、
顔のアタッチメントポイントの設定をサポートします。 フェイスメッシュコンポーネントは、ヒエラルキーの(+)ボタンで追加できます。 Studio
には、XRエクスペリエンスをプレビューするためのツールも用意されています。XRプロジェ クトの
テストについては、シミュレータのセクションを参照してください。

![AugmentedRealityAddFace](/images/studio/augmented-reality-add-face.png)

![AugmentedRealityFaceMesh](/images/studio/augmented-reality-face-mesh.png)

スタジオでフェイスエフェクトをプレビューする場合、フェイスカメラは原点（0, 0, 0）に配置されます。一方、
下のスクリーンショットのように、フェイスアンカーはフェイスカメラの前に配置されます。

![FaceEffectsCamera](/images/studio/xr-face-camera.png)

## XR API リファレンス {#xr-api-reference}

カメラの動作を定義する[Camera](/api/studio/ecs/camera)コンポーネントAPIを参照してください。