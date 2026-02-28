# onAppResourcesLoaded()

onAppResourcesLoaded: ({ framework, imageTargets, version })\\`。

## 説明 {#description}

onAppResourcesLoaded()\\`は、サーバーからアプリにアタッチされたリソースを受け取ったときに呼び出される。

## パラメータ {#parameters}

| パラメータ                                          | 説明                                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------------- |
| フレームワーク                                        | イベントをディスパッチするための、このモジュールのフレームワークバインディング。                                |
| imageTargets [オプション］ | フィールド {imagePath, metadata, name}を持つイメージターゲットの配列。                       |
| バージョン                                          | エンジンのバージョン（例：14.0.8.949 |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name = 'myPipelineModule',
  onAppResourcesLoaded = ({ framework, version, imageTargets }) => {
    //....
  },
})
```
