# onUpdate()

`onUpdate: ({ framework, frameStartResult, processGpuResult, processCpuResult })`

## Beschreibung {#description}

onUpdate()`wird aufgerufen, um die Szene vor dem Rendern zu aktualisieren. Aufgerufen mit`{ framework, frameStartResult, processGpuResult, processCpuResult }`. Daten, die von Modulen in [`onProcessGpu`](onprocessgpu.md) und [`onProcessCpu`](onprocesscpu.md) zurückgegeben werden, liegen als `processGpu.modulename`und`processCpu.modulename\\` vor, wobei der Name durch module.name = "modulename" gegeben ist.

## Parameter {#parameters}

| Parameter        | Beschreibung                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Rahmenwerk       | Die Framework-Bindings für dieses Modul zum Versenden von Ereignissen.                                     |
| frameStartResult | Die Daten, die zu Beginn eines Frames bereitgestellt wurden.                                               |
| processGpuResult | Daten, die von allen installierten Modulen während [`onProcessGpu`](onprocessgpu.md) zurückgegeben werden. |
| processCpuResult | Daten, die von allen installierten Modulen während [`onProcessCpu`](onprocesscpu.md) zurückgegeben werden. |

## Beispiel {#example}

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
