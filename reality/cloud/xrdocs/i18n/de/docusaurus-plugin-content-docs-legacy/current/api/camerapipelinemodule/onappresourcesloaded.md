# onAppResourcesLoaded()

`onAppResourcesLoaded: ({ framework, imageTargets, version })`

## Beschreibung {#description}

`onAppResourcesLoaded()` wird aufgerufen, wenn wir die Ressourcen, die einer Anwendung zugeordnet sind, vom Server erhalten haben.

## Parameter {#parameters}

| Parameter                                                                   | Beschreibung                                                                                                       |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Rahmenwerk                                                                  | Die Framework-Bindings für dieses Modul zum Versenden von Ereignissen.                             |
| imageTargets [Optional] | Ein Array von Bildzielen mit den Feldern {imagePath, metadata, name}                                               |
| Version                                                                     | Die Motorversion, z. B. 14.0.8.949 |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name = 'myPipelineModule',
  onAppResourcesLoaded = ({ framework, version, imageTargets }) => {
    //...
  },
})
```
