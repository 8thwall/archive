# onProcesarCpu()

`onProcessCpu: ({ framework, frameStartResult, processGpuResult })`

## Descripción {#description}

Se llama a `onProcessCpu()` para leer los resultados del procesamiento en la GPU y devolver los datos utilizables. Llamada con
`{ frameStartResult, processGpuResult }`. Los datos devueltos por los módulos en
[`onProcessGpu`](onprocessgpu.md) estarán presentes como `processGpu.modulename` donde el nombre viene dado
por module.name = "modulename".

| Parámetro        | Descripción                                                                            |
| ---------------- | -------------------------------------------------------------------------------------- |
| marco            | Los enlaces de este módulo para el envío de eventos.                   |
| frameStartResult | Los datos que se proporcionaron al principio de un fotograma.          |
| processGpuResult | Datos devueltos por todos los módulos instalados durante onProcessGpu. |

## Devuelve {#returns}

Cualquier dato que desee proporcionar a [`onUpdate`](onupdate.md) debe ser devuelto. Será
proporcionado a ese método como `processCpuResult.modulename`.

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ frameStartResult, processGpuResult }) => {
    const GLctx = frameStartResult.GLctx
    const { cameraTexture } = frameStartResult
    const { camerapixelarray, mycamerapipelinemodule } = processGpuResult

    // Hacer algo interesante con mycamerapipelinemodule.gpuDataA y mycamerapipelinemodule.gpuDataB
    ...

    // Estos campos se proporcionarán a onUpdate
    return {cpuDataA, cpuDataB}
  },
})
```
