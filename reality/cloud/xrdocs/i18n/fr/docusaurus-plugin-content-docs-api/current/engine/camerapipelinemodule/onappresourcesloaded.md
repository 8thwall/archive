# onAppResourcesLoaded()

`onAppResourcesLoaded : ({ framework, imageTargets, version })`

## Description {#description}

`onAppResourcesLoaded()` est appelé lorsque nous avons reçu du serveur les ressources attachées à une application.

## Paramètres {#parameters}

| Paramètres                                                                    | Description                                                                                  |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| cadre                                                                         | Les liaisons de ce module avec le cadre pour l'envoi d'événements.           |
| imageTargets [Facultatif] | Un tableau de cibles d'images avec les champs {imagePath, metadata, name}                    |
| version                                                                       | La version du moteur, par exemple 14.0.8.949 |

## Exemple {#example}

```javascript
XR8.addCameraPipelineModule({
  name = 'myPipelineModule',
  onAppResourcesLoaded = ({ framework, version, imageTargets }) => {
    //...
  },
})
```
