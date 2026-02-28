# XR8.プレイキャンバス

PlayCanvas (<https://www.playcanvas.com/>) は、オープンソースの3Dゲームエンジン/インタラクティブ3D
アプリケーションエンジンであり、独自のクラウドホスト型制作プラットフォームとともに、ブラウザベースのインターフェースを介して複数のコンピュータから
同時編集を可能にする。

## 説明 {#description}

PlayCanvas カメラを駆動して仮想オーバーレイを行うために、PlayCanvas 環境およびライフサイクルとのインターフェイスを提供する統合。

## 機能 {#functions}

| 機能                                         | 説明                                                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| [run](run.md)                              | 指定されたパイプラインモジュールでカメラを開き、PlayCanvasシーンで実行を開始します。                                                                           |
| [runXr（非推奨）](runxr.md)                     | カメラを開き、PlayCanvas シーン内で World Tracking または Image Tracking の実行を開始します。                                                      |
| [runFaceEffects（非推奨）](runfaceeffects.md)   | カメラを開き、PlayCanvasシーンでFace Effectsの実行を開始します。                                                                               |
| [ストップ](stop.md)                            | run](run.md) で追加したモジュールを削除し、カメラを停止します。                       |
| [stopXr（非推奨）](stopxr.md)                   | runXr](runxr.md) で追加したモジュールを削除し、カメラを停止します。                   |
| [stopFaceEffects（非推奨）](stopfaceeffects.md) | runFaceEffects](runfaceeffects.md) で追加したモジュールを削除し、カメラを停止します。 |
