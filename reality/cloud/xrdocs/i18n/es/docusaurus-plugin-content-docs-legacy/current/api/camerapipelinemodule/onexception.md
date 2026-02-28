# onException()

`onException: (error)`

## Descripción {#description}

Se llama a `onException()` cuando se produce un error en XR. Llamada con el objeto de error.

## Parámetros {#parameters}

| Parámetro | Descripción                 |
| --------- | --------------------------- |
| error     | El objeto de error arrojado |

## Ejemplo {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
    onException : (error) => {
      console.error('XR lanzó una excepción', error)
  },
})
```
