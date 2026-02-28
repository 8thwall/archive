# onResume()

`onResume: ()`

## 説明 {#description}

`onResume()`は、[`XR8.resume()`](/api/engine/xr8/resume)が呼ばれたときに呼び出されます。

## パラメータ {#parameters}

なし

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onResume: () => {
    console.log('resuming application')
  },
})
```
