# onProcessCpu()

onProcessCpu: ({ framework, frameStartResult, processGpuResult })\\`.

## 説明 {#description}

onProcessCpu()`は、GPU処理の結果を読み込んで使用可能なデータを返すために呼び出される。 
`{ frameStartResult, processGpuResult }` で呼び出される。 onProcessCpu()`は、GPU処理の結果を読み込んで使用可能なデータを返すために呼び出される。
`{ frameStartResult, processGpuResult }\` で呼び出される。[`onProcessGpu`](onprocessgpu.md) のモジュールによって返されるデータは、`processGpu.modulename` として存在する。onprocessgpu.md
`{ frameStartResult, processGpuResult }` で呼び出される。 onProcessCpu()`は、GPU処理の結果を読み込んで使用可能なデータを返すために呼び出される。
`{ frameStartResult, processGpuResult }\` で呼び出される。[`onProcessGpu`](onprocessgpu.md) のモジュールによって返されるデータは、`processGpu.modulename\` として存在する。onprocessgpu.md

| パラメータ            | 説明                                           |
| ---------------- | -------------------------------------------- |
| フレームワーク          | イベントをディスパッチするための、このモジュールのフレームワークバインディング。     |
| フレーム開始結果         | フレームの最初に提供されたデータ。                            |
| processGpuResult | onProcessGpu中にインストールされているすべてのモジュールから返されるデータ。 |

## {#returns}を返す。

onUpdate`](onupdate.md) に提供したいデータがあれば、それを返すべきである。 onUpdate`](onupdate.md) に提供したいデータがあれば、それを返すべきである。 これは、
`processCpuResult.modulename\` としてそのメソッドに提供される。

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ frameStartResult, processGpuResult }) => {
    const GLctx = frameStartResult.GLctx
    const { cameraTexture } = frameStartResult
    const { camerapixelarray, mycamerapipelinemodule } = processGpuResult

    // mycamerapipelinemodule.gpuDataAとmycamerapipelinemodule.gpuDataBで何か面白いことをする
    ...

    // これらのフィールドは onUpdate に提供される
    return {cpuDataA, cpuDataB}
  },
})
```
