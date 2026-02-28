# GlTextureRenderer

## Descripción {#description}

Proporciona un módulo de canalización de cámara que dibuja la alimentación de la cámara en un lienzo, así como utilidades adicionales para operaciones de dibujo GL.

## Funciones {#functions}

| Función                                                         | Descripción                                                                                                                                                                                                                       |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                                       | Configura el módulo de canalización que dibuja la imagen de la cámara en el lienzo.                                                                                                                                               |
| [crear](create.md)                                              | Crea un objeto para renderizar desde una textura a un lienzo u otra textura.                                                                                                                                                      |
| [fillTextureViewport](filltextureviewport.md)                   | Método práctico para obtener una estructura de Vista que rellene una textura o lienzo a partir de una fuente sin distorsión. Se pasa al método de renderizado del objeto creado por [`XR8.GlTextureRenderer.create()`](create.md) |
| [getGLctxParameters](getglctxparameters.md)                     | Obtiene el conjunto actual de enlaces WebGL para poder restaurarlos más tarde.                                                                                                                                                    |
| [pipelineModule](pipelinemodule.md)                             | Crea un módulo de canalización que dibuja la imagen de la cámara en el lienzo.                                                                                                                                                    |
| [setGLctxParameters](setglctxparameters.md)                     | Restaura las vinculaciones WebGL que se guardaron con [`XR8.GlTextureRenderer.getGLctxParameters()`](getglctxparameters.md).                                                                                                      |
| [setTextureProvider](settextureprovider.md)                     | Establece un proveedor que pasa la textura a dibujar.                                                                                                                                                                             |
| [setForegroundTextureProvider](setforegroundtextureprovider.md) | Establece un proveedor que pasa una lista de texturas de primer plano y máscaras alfa para dibujar.                                                                                                                               |
