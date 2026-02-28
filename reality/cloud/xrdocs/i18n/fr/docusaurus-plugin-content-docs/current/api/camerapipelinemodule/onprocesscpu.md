# onProcessCpu()

`onProcessCpu : ({ framework, frameStartResult, processGpuResult })`

## Description {#description}

`onProcessCpu()` est appelé pour lire les résultats du traitement par le GPU et renvoyer des données utilisables. Appelé avec `{ frameStartResult, processGpuResult }`. Les données renvoyées par les modules dans [`onProcessGpu`](onprocessgpu.md) seront présentes sous `processGpu.modulename` où le nom est donné par module.name = "modulename".

| Paramètres       | Description                                                                        |
| ---------------- | ---------------------------------------------------------------------------------- |
| cadre            | Les liaisons de ce module avec le cadre pour l'envoi d'événements.                 |
| frameStartResult | Les données fournies au début d'une trame.                                         |
| processGpuResult | Données renvoyées par tous les modules installés lors de l'opération onProcessGpu. |

## Retours {#returns}

Toutes les données que vous souhaitez fournir à [`onUpdate`](onupdate.md) doivent être renvoyées. Il sera fourni à cette méthode en tant que `processCpuResult.modulename`

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onProcessCpu : ({ frameStartResult, processGpuResult }) => {
    const GLctx = frameStartResult.GLctx
    const { cameraTexture } = frameStartResult
    const { camerapixelarray, mycamerapipelinemodule } = processGpuResult

    // Faites quelque chose d'intéressant avec mycamerapipelinemodule.gpuDataA et mycamerapipelinemodule.gpuDataB
    ...

    // Ces champs seront fournis à onUpdate
    return {cpuDataA, cpuDataB}
  },
})
```
