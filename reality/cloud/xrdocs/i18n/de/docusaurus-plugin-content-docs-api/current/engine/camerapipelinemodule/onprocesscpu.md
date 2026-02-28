# onProcessCpu()

`onProcessCpu: ({ framework, frameStartResult, processGpuResult })`

## Beschreibung {#description}

onProcessCpu()`wird aufgerufen, um die Ergebnisse der GPU-Verarbeitung zu lesen und verwertbare Daten zurückzugeben. Aufgerufen mit`{ frameStartResult, processGpuResult }`. Daten, die von Modulen in [`onProcessGpu`](onprocessgpu.md) zurückgegeben werden, liegen als `processGpu.modulename\\` vor, wobei der Name
durch module.name = "modulename" angegeben wird.

| Parameter        | Beschreibung                                                                                          |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| Rahmenwerk       | Die Framework-Bindings für dieses Modul zum Versenden von Ereignissen.                |
| frameStartResult | Die Daten, die zu Beginn eines Frames bereitgestellt wurden.                          |
| processGpuResult | Daten, die von allen installierten Modulen während onProcessGpu zurückgegeben werden. |

## Rückgabe {#returns}

Alle Daten, die Sie an [`onUpdate`](onupdate.md) übermitteln möchten, sollten zurückgegeben werden. Er wird unter
als `processCpuResult.modulename` an diese Methode übergeben.

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ frameStartResult, processGpuResult }) => {
    const GLctx = frameStartResult.GLctx
    const { cameraTexture } = frameStartResult
    const { camerapixelarray, mycamerapipelinemodule } = processGpuResult

    // Mach etwas Interessantes mit mycamerapipelinemodule.gpuDataA und mycamerapipelinemodule.gpuDataB
    ...

    // Diese Felder werden an onUpdate übergeben
    return {cpuDataA, cpuDataB}
  },
})
```
