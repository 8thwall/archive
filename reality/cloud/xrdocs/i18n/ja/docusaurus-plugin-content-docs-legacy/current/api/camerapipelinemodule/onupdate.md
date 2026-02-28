# onUpdate()

onUpdate:({フレームワーク、frameStartResult、processGpuResult、processCpuResult })\\`。

## 説明 {#description}

onUpdate()`は、レンダリングの前にシーンを更新するために呼ばれる。 framework, frameStartResult, processGpuResult, processCpuResult }`で呼び出される。 onProcessGpu`](onprocessgpu.md) と [`onProcessCpu`](onprocesscpu.md) のモジュールが返すデータは `processGpu.modulename`と`processCpu.modulename\` として存在する。 framework, frameStartResult, processGpuResult, processCpuResult }`で呼び出される。 onProcessGpu`](onprocessgpu.md) と [`onProcessCpu`](onprocesscpu.md) のモジュールが返すデータは `processGpu.modulename`と`processCpu.modulename\` として存在する。

## パラメータ {#parameters}

| パラメータ            | 説明                                                                                                                                |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| フレームワーク          | イベントをディスパッチするための、このモジュールのフレームワークバインディング。                                                                                          |
| フレーム開始結果         | フレームの最初に提供されたデータ。                                                                                                                 |
| processGpuResult | onProcessGpu\\`](onprocessgpu.md) 中に、インストールされているすべてのモジュールから返されるデータ。 |
| processCpuResult | onProcessCpu\\`](onprocesscpu.md) 中に、インストールされているすべてのモジュールから返されるデータ。 |

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onUpdate: ({ frameStartResult, processGpuResult, processCpuResult }) => {
    if (!processCpuResult.reality) {
      return
    }
    const {rotation, position, intrinsics} = processCpuResult.reality
    const {cpuDataA, cpuDataB} = processCpuResult.mycamerapipelinemodule
    // ...
  },
})
```
