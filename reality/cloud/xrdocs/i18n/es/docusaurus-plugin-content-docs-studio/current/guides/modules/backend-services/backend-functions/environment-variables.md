---
id: environment-variables
sidebar_position: 3
---

# Variables de entorno

Las variables de entorno le permiten mantener a salvo la información sensible asociada a su módulo.
Por ejemplo, le permiten almacenar y pasar credenciales de autenticación sin exponerlas
directamente en su código.

## Crear variables de entorno

1. Seleccione la función back-end dentro de su módulo.
2. Haga clic en "Nueva variable de entorno".

![NewEnvironmentVariable](/images/studio/bfn-new-environment-variable.png)

3. Definir una clave (nombre de variable)

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-key.png)

4. Definir una etiqueta: es el nombre de la tecla que se mostrará al proyecto que utilice el módulo
   que contiene la función backend.

![NewEnvironmentVariable](/images/studio/bfn-environment-variable-label.png)

## Variable de entorno de acceso en código

Se puede acceder a las variables de entorno en su código como `process.env.<KEY>`

### Ejemplo:

```ts
const API_KEY = process.env.api_key
```
