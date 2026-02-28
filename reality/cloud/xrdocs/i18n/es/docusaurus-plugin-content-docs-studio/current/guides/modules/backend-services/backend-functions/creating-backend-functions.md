---
id: creating-backend-functions
sidebar_position: 1
---

# Creación de funciones backend

:::info
Las Funciones Backend se ejecutan en el contexto del Sistema de Módulos de 8th Wall. Para consultar la documentación completa del módulo
, [véase aquí](https://www.8thwall.com/docs/guides/modules/overview/).  Esta sección de la documentación de
se centrará específicamente en la funcionalidad de la Función Backend proporcionada por el sistema del módulo
.
:::

Los módulos pueden crearse desde la página Espacio de trabajo (pestaña Módulos) o directamente dentro de un proyecto de Studio. Para
crear un Módulo con una Función Backend directamente en Studio, por favor siga estos pasos:

1. En el Editor de Studio, seleccione la pestaña Modulese del panel izquierdo y haga clic en "+ Nuevo módulo".

![CreateNewModule](/images/studio/bfn-new-module.png)

2. Seleccione la pestaña "Crear nuevo módulo" y asigne a su nuevo módulo un ID de módulo.  Este valor se utilizará
   para referenciar posteriormente su módulo en el código del proyecto.  No puede modificarse después de la creación.

![ModuleId](/images/studio/bfn-module-id.png)

3. Añade un backend al módulo: Explorador de archivos -> seleccione la pestaña Módulos -> haga clic con el botón derecho en Backends ->
   seleccione New Backend config.

![NewBackendFunction](/images/studio/bfn-new-backend-config.png)

4. En el asistente de Nuevo Backend, seleccione el tipo de backend deseado (Función, en este caso), dele un
   Título y Descripción. El nombre de archivo del backend se generará automáticamente basándose en el Título
   y es la forma en que hará referencia al backend dentro del código del módulo.

![NewBackend](/images/studio/bfn-new-backend.png)

5. Establezca una ruta de entrada para su código backend.  Este es el archivo donde su punto de entrada de código backend
   vivirá.

![BackendFunctionEntryPath](/images/studio/bfn-entry-path.png)

6. Cree un archivo con la misma ruta/nombre que la definida en el paso Ruta de entrada anterior.  Haga clic con el botón derecho en Archivos -> Archivo nuevo -> Archivo vacío:

![BackendFunctionEmptyFile](/images/studio/bfn-create-empty-file.png)

Escriba o pegue el nombre que coincida con su ruta de entrada:

![BackendFunctionEmptyFileName](/images/studio/bfn-create-empty-file-name.png)

Resultado:

![BackendFunctionEmptyFileNameResult](/images/studio/bfn-create-empty-file-result.png)

:::info
La función backend debe exportar un **método async** llamado `handler`.  Por favor, consulte la documentación [Writing Backend Code](/studio/guides/modules/backend-services/backend-functions/writing-backend-code/) para más detalles.
:::

Ejemplo:

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
