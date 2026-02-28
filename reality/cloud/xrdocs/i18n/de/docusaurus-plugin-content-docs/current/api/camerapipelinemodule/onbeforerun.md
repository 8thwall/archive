# onBeforeRun()

`onBeforeRun: ({ config })`

## Beschreibung {#description}

`onBeforeRun` wird unmittelbar nach [XR8.run()](/api/xr8/run) aufgerufen. Wenn irgendwelche Versprechen zurückgegeben werden, wartet XR auf alle Versprechen, bevor es weitergeht.

## Parameter {#parameters}

| Parameter | Beschreibung                                                                    |
| --------- | ------------------------------------------------------------------------------- |
| config    | Die Konfigurationsparameter, die an [XR8.run()](/api/xr8/run) übergeben wurden. |
