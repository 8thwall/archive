---
id: debug-mode
---

# Modo depuración

El modo de depuración es una función avanzada del Editor Cloud que proporciona registros, información sobre el rendimiento y visualizaciones mejoradas de
directamente en su dispositivo.

Nota: El modo de depuración no se muestra actualmente al previsualizar experiencias en dispositivos montados en la cabeza.

#### Para activar el modo depuración {#to-activate-debug-mode}

1. En la parte superior de la ventana del Editor de nubes, haga clic en el botón **Previsualizar**.
2. Debajo del código QR, activa el **Modo Depuración**.
3. Escanea el código QR para previsualizar tu proyecto WebAR con información de depuración superpuesta sobre la página:

![debug1](/images/debug-mode-preview.jpg)

Si ya tienes un dispositivo conectado en la consola del Editor Cloud puedes activar/desactivar el Modo Depuración
en cualquier momento pulsando el conmutador "Modo Depuración" cuando tengas seleccionada la pestaña del dispositivo.

![debug2](/images/debug-mode-console.jpg)

Estadísticas en modo depuración:

Dependiendo del renderizador que esté utilizando su proyecto, el Modo Depuración mostrará alguna de la siguiente información:

![debug3](/images/debug-mode-stats.jpg)

<u>Panel de estadísticas</u> (pulse para minimizar)

- fps - fotogramas por segundo, framerate.
- Tris - número de triángulos renderizados por fotograma.\*
- Llamadas de dibujo - número de llamadas de dibujo en cada fotograma. Una llamada a dibujar es una llamada a la API gráfica para dibujar objetos (por ejemplo, dibujar un triángulo).\*
- Texturas - número de texturas en la escena.\*
- Tex(max) - la dimensión máxima de la textura más grande de la escena.\*
- Shaders - número de shaders GLSL en la escena.\*
- Geometrías - número de geometrías en la escena.\*
- Puntos - número de puntos en la escena. Sólo aparece cuando la escena tiene más de 0.\*
- Entidades - número de entidades A-Frame en la escena.\*
- ImgTargets - número de objetivos de imagen 8th Wall activos en la escena.
- Modelos - tamaño total en MB de todos los `<a-asset-items>` (sólo modelos 3D precargados) en `<a-assets>`.\*

<u>Versión Panel</u>

- Versión del motor: versión del motor de realidad aumentada 8th Wall que utiliza la experiencia.
- Versión del renderizador - versión del renderizador que está ejecutando la experiencia.\*

<u>Panel de herramientas</u>

- Consola: muestra los registros de la consola en tiempo real.
- Acciones - opciones para restablecer la cámara XR (XR8.recenter()), mostrar la superficie detectada\*, y mostrar el inspector A-Frame\*.
- Cámara - muestra la posición y rotación de la cámara XR.
- Minimizar - minimiza el panel de herramientas.

[\*] disponible en los proyectos del Editor de Nubes que utilizan A-Frame
