# onUpdate()

`onUpdate : ({ framework, frameStartResult, processGpuResult, processCpuResult })`

## Description {#description}

`onUpdate()` est appelé pour mettre à jour la scène avant le rendu. Appelé avec `{ framework, frameStartResult, processGpuResult, processCpuResult }`. Les données renvoyées par les modules dans [`onProcessGpu`](onprocessgpu.md) et [`onProcessCpu`](onprocesscpu.md) seront présentes en tant que `processGpu.modulename` et `processCpu.modulename` où le nom est donné par module.name = "modulename".

## Paramètres {#parameters}

| Paramètres       | Description                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------- |
| cadre            | Les liaisons de ce module avec le cadre pour l'envoi d'événements.                          |
| frameStartResult | Les données fournies au début d'une trame.                                                  |
| processGpuResult | Données renvoyées par tous les modules installés pendant [`onProcessGpu`](onprocessgpu.md). |
| processCpuResult | Données renvoyées par tous les modules installés pendant [`onProcessCpu`](onprocesscpu.md). |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name : 'mycamerapipelinemodule',
  onUpdate : ({ frameStartResult, processGpuResult, processCpuResult }) => {
    if (!processCpuResult.reality) {
      return
    }
    const {rotation, position, intrinsics} = processCpuResult.reality
    const {cpuDataA, cpuDataB} = processCpuResult.mycamerapipelinemodule
    // ...
  },
})
```
