# onAppResourcesLoaded()

`onAppResourcesLoaded: ({ framework, imageTargets, version })`

## Beschreibung {#description}

`onAppResourcesLoaded()` wird aufgerufen, wenn wir die mit einer App verbundenen Ressourcen vom Server erhalten haben.

## Parameter {#parameters}

| Parameter               | Beschreibung                                                            |
| ----------------------- | ----------------------------------------------------------------------- |
| framework               | Die Framework-Bindungen für dieses Modul zum Versenden von Ereignissen. |
| imageTargets [Optional] | Ein Array von Bildzielen mit den Feldern {imagePath, metadata, name}    |
| version                 | Die Engine-Version, z.B. 14.0.8.949                                     |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name = 'myPipelineModule',
  onAppResourcesLoaded = ({ framework, version, imageTargets }) => {
    //...
  },
})
```
