# onPaused()

`onPaused: ()`

## 説明 {#description}

`onPaused()` は [`XR8.pause()`](/api/engine/xr8/pause) が呼ばれたときに呼び出されます。

## パラメータ {#parameters}

なし

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onPaused：() => {
    console.log('pausing application')
  },
})
```
