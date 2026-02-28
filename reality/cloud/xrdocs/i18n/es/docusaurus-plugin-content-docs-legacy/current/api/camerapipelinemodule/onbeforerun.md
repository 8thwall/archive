# onBeforeRun()

`onBeforeRun: ({ config })`

## Descripción {#description}

`onBeforeRun` se llama inmediatamente después de [XR8.run()](/legacy/api/xr8/run). Si se devuelve alguna promesa, XR esperará todas las promesas antes de continuar.

## Parámetros {#parameters}

| Parámetro | Descripción                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| config    | Los parámetros de configuración que se pasaron a [XR8.run()](/legacy/api/xr8/run). |
