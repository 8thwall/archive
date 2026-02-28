---
id: debug-mode
---

# Modo depuración

El modo depuración es una función avanzada del editor de la nube que proporciona registros, información sobre el rendimiento y visualizaciones mejoradas directamente en su dispositivo.

Nota: el modo depuración no se muestra actualmente al previsualizar experiencias en dispositivos de cabeza.

#### Activar el modo depuración {#to-activate-debug-mode}

1. En la parte superior de la ventana del editor de la nube, haga clic en el botón **Vista previa**.
2. Debajo del código QR, active el **modo depuración**.
3. Escanee el código QR para previsualizar su proyecto WebAR con la información de depuración superpuesta sobre la página:

![debug1](/images/debug-mode-preview.jpg)

Si ya tiene un dispositivo conectado a la consola del editor de la nube, puede activar/desactivar el modo depuración en cualquier momento alternando el "Modo depuración" cuando tenga seleccionada la pestaña del dispositivo.

![debug2](/images/debug-mode-console.jpg)

Estadísticas del modo depuración:

Dependiendo del renderizador que utilice su proyecto, el modo depuración mostrará parte de la siguiente información:

![debug3](/images/debug-mode-stats.jpg)

<u>Panel de estadísticas</u> (pulse para minimizar)

* fps - fotogramas por segundo, velocidad de fotograma.
* Tris - número de triángulos renderizados por fotograma.\*
* Llamadas a dibujo - número de llamadas a dibujo en cada fotograma. Una llamada a dibujar es una llamada a la API gráfica para dibujar objetos (por ejemplo, dibujar un triángulo).\*
* Texturas - número de texturas de la escena.\*
* Tex(max) - la dimensión máxima de la textura más grande de la escena.\*
* Sombreadores - número de sombreadores GLSL en la escena.\*
* Geometrías - número de geometrías de la escena.\*
* Puntos - número de puntos de la escena. Solo se muestra cuando la escena tiene más de 0,\*
* Entidades - número de entidades A-Frame en la escena.\*
* Objetivos de imagen - número de objetivos de imagen de 8th Wall activos en la escena.
* Modelos - tamaño total en MB de todos los `<a-asset-items>` (solo modelos 3D cargados previamente) en `<a-assets>`.\*

<u>Panel de la versión</u>

* Versión del motor - versión del motor de AR de 8th Wall que utiliza la experiencia.
* Versión del renderizador - versión del renderizador que está ejecutando la experiencia.\*

<u>Panel de herramientas</u>

* Consola - muestra los registros de la consola en directo.
* Acciones - opciones para restablecer la cámara XR (XR8.recenter()), mostrar la superficie detectada\*, y mostrar el inspector de A-Frame\*.
* Cámara - muestra la posición y rotación de la cámara XR.
* Minimizar - minimiza el panel de herramientas.

[*] disponible en los proyectos del editor de las nubes que utilizan A-Frame
