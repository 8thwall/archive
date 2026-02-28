# onUpdate()

`onUpdate: ({ framework, frameStartResult, processGpuResult, processCpuResult })`

## Descripción {#description}

`onUpdate()` se llama para actualizar la escena antes de renderizarla. Llamada con `{ framework, frameStartResult, processGpuResult, processCpuResult }`. Los datos devueltos por los módulos en [`onProcessGpu`](onprocessgpu.md) y [`onProcessCpu`](onprocesscpu.md) estarán presentes como `processGpu.modulename` y `processCpu.modulename` donde el nombre viene dado por module.name = "modulename".

## Parámetros {#parameters}

| Parámetro        | Descripción                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| framework        | Los enlaces del marco de este módulo para enviar eventos.                                   |
| frameStartResult | Los datos que se proporcionaron al principio de un fotograma.                               |
| processGpuResult | Datos devueltos por todos los módulos instalados durante [`onProcessGpu`](onprocessgpu.md). |
| processCpuResult | Datos devueltos por todos los módulos instalados durante [`onProcessCpu`](onprocesscpu.md). |

## Ejemplo {#example}

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
