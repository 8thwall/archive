# onBeforeRun()

`onBeforeRun : ({ config })`

## Description {#description}

`onBeforeRun` est appelé immédiatement après [XR8.run()](/api/engine/xr8). Si des promesses sont renvoyées, XR attendra toutes les promesses avant de continuer.

## Paramètres {#parameters}

| Paramètres | Description                                                                                                                             |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| config     | Les paramètres de configuration qui ont été transmis à [XR8.run()](/api/engine/xr8). |
