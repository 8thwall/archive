# onBeforeRun()

onBeforeRun: ({ config })\\`

## Beschreibung {#description}

onBeforeRun" wird unmittelbar nach [XR8.run()](/api/engine/xr8) aufgerufen. Wenn irgendwelche Versprechen zurückgegeben werden, wartet XR auf alle Versprechen, bevor es weitergeht.

## Parameter {#parameters}

| Parameter     | Beschreibung                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Konfiguration | Die Konfigurationsparameter, die an [XR8.run()](/api/engine/xr8) übergeben wurden. |
