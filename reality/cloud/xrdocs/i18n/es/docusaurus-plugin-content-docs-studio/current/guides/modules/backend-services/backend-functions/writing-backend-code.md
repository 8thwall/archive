---
id: writing-backend-code
sidebar_position: 2
---

# Escribir código backend

## Descripción general

El código de la función backend se ejecuta en un entorno sin servidor asociado a tu cuenta de 8th Wall.
Todas las funciones backend deben exportar un método **async** de nivel superior llamado `handler`, que es el punto de entrada
a la función backend.

Ejemplo de código de archivo de entrada:

```javascript
const handler = async (event: any) => {
  // Custom backend code goes here

  return {
    body: JSON.stringify({
      myResponse,
    }),
  }
}

export {
  handler,
}
```

## Método cliente

Cuando creas una función backend, se crea automáticamente un método cliente para ti. Este método del cliente
es una envoltura alrededor de `fetch`, lo que significa que puede pasar los mismos argumentos a esta función como lo haría
con una llamada normal a `fetch`. Consulte [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch)
para obtener más detalles.

Este método cliente es la forma de enviar peticiones desde el código cliente del módulo a la función backend.

![FetchWrapper](/images/studio/bfn-fetch-wrapper.png)

## Función Parámetros del evento

El método handler se invoca con un objeto `event` cada vez que se llama al método cliente. `event`
tiene las siguientes propiedades:

| Propiedad             | Tipo                                              | Descripción                                                                                                                                                       |
| --------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ruta                  | cadena                                            | La ruta URL pasada al método cliente (`'/getUser/foo'` , `'/checkAnswer'`, etc).                                               |
| body                  | cadena                                            | Llama a `JSON.parse(event.body)` para transformar el cuerpo en un objeto.                                                                         |
| httpMétodo            | cadena                                            | El método HTTP utilizado para llamar a la función backend. Una de las opciones `'GET'`, `'PUT'`, `'POST'`, `'PATCH'`, `'DELETE'`. |
| queryStringParameters | Registro<string, string> | Pares clave/valor que contienen los parámetros de la cadena de consulta de la solicitud.                                                          |
| cabeceras             | Registro<string, string> | Pares clave/valor que contienen cabeceras de solicitud.                                                                                           |

## Devolver objeto

Todas las propiedades son opcionales.

| Propiedad  | Tipo                                              | Descripción                                                                                |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| statusCode | número                                            | El código de estado de la respuesta. Por defecto es `200`. |
| cabeceras  | Registro<string, string> | Las cabeceras asociadas a la respuesta.                                    |
| body       | cadena                                            | El objeto body `JSON.stringify()` asociado a la respuesta.                 |

## Tratamiento de errores

Si la función backend lanza una excepción no capturada, la función devolverá `statusCode: 500`
con un objeto de error en el cuerpo de la respuesta.

Si eres **propietario** del módulo y estás **en modo desarrollo**, el objeto de error contendrá `name`,
`message` y `stack`:

`{error: {name: string, message: string, stack: string}}`

Ejemplo:

```
{
  "error": {
    "name": "TypeError",
    "message": "Cannot read properties of undefined (reading 'foo')",
    "stack": "TypeError: Cannot read properties of undefined (reading 'foo')\n at call (webpack:///src/index.ts:8:24)\n ...
  }
}
```

Para el **modo de no desarrollo**, el objeto de error no contendrá una propiedad `name` o `stack` y el `message` de
será un genérico "Internal Server Error".

## Fijación de objetivos

Consulte https://www.8thwall.com/docs/guides/modules/pinning-targets/ para obtener más información sobre los objetivos de fijación de módulos de
.

Cuando se fija a una `Versión`, **Actualizaciones permitidas** debe establecerse en `Ninguna`.

![BFNVersionPinning](/images/studio/bfn-version-pinning.png)

Al anclar a un `Commit`, seleccione un commit específico.  No se admite `Latest`.

![BFNCommitPinning](/images/studio/bfn-commit-pinning.png)
