# onException()

onException:(エラー)\\`。

## 説明 {#description}

onException()\\`は、XRでエラーが発生したときに呼び出される。 エラーオブジェクトと共に呼び出される。 エラーオブジェクトと共に呼び出される。

## パラメータ {#parameters}

| パラメータ | 説明              |
| ----- | --------------- |
| エラー   | スローされたエラーオブジェクト |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
    onException : (error) => {
      console.error('XR threw an exception', error)
  },
})
```
