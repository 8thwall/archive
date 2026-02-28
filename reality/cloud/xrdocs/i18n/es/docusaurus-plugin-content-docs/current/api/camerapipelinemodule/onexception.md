# onException()

`onException: (error)`

## Descripción {#description}

`onException()` se llama cuando se produce un error en XR. Llamada con el objeto de error.

## Parámetros {#parameters}

| Parámetro | Descripción                          |
| --------- | ------------------------------------ |
| error     | El objeto de error que se ha lanzado |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
    onException : (error) => {
      console.error('XR threw an exception', error)
  },
})
```
