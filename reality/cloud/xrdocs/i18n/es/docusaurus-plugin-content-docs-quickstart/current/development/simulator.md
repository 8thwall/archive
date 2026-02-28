---
id: simulator
sidebar_position: 2
---

# Simulador

Cuando vayas a reproducir tu escena - conecta una instancia del Simulador. El simulador reflejará remotamente en
los cambios realizados en el Viewport.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

El simulador te permite probar y ver los cambios del proyecto en diferentes tamaños de dispositivo y
simula entornos reales sin necesidad de salir de Studio. El simulador funciona ejecutando
the 8th Wall AR Engine en tiempo real sobre la colección incluida de secuencias AR pregrabadas.
Puede abrir tantas instancias del Simulador como desee, lo que le permite probar los cambios del proyecto en una amplia gama de escenarios
. El Simulador dispone de una serie de controles de reproducción y funciones de comodidad
como:

- Barra de reproducción, scrubber y tiradores de entrada/salida: Le permiten establecer puntos de bucle, lo que le proporciona un control granular
  sobre la secuencia seleccionada.
- Botón de recentrado (abajo a la derecha): Recentra la alimentación de la cámara a su origen. NOTA: También se llama a Recenter en
  cada vez que la secuencia hace un bucle y cada vez que se selecciona una nueva secuencia.
- Botón Actualizar (arriba a la derecha): Actualiza la página, conservando el contenido almacenado en caché. Si mantienes pulsada la tecla SHIFT y haces clic en el botón de actualización de
  , se realizará una recarga completa, ignorando cualquier contenido almacenado en caché.

Puede simular su experiencia a través de una gama de diferentes secuencias de RA que le permiten probar los efectos de cara
, seguimiento de manos, efectos de mundo, escala absoluta, RA compartida y mucho más. Una secuencia de RA incluye
tanto los datos de grabación de vídeo como los datos registrados por el giroscopio o la orientación del dispositivo para que pueda simular la RA de
. Utilice el menú de selección de secuencia de la parte inferior izquierda para cambiar la secuencia AR. Puede utilizar el carrusel
para cambiar entre las opciones de la categoría de secuencia. La pausa de la secuencia sólo detiene el vídeo,
permitiéndole probar los cambios en el mismo fotograma. Arrastra los tiradores de reproducción para establecer puntos de bucle de entrada/salida.

![Simulator2](/images/studio/studio-navigate-simulator2.png)

![SimulatorSequenceSelector](/images/simulator-sequence-selector.jpg)

Live View sigue la misma lógica que la configuración de la cámara de su proyecto, lo que le permite simular
su proyecto utilizando la alimentación de su escritorio en lugar de una secuencia AR pregrabada. Por ejemplo, si
su proyecto utiliza Efectos faciales y tiene el proyecto Studio abierto en el escritorio, se abrirá su cámara de escritorio
. Nota: La Vista en Directo en el Simulador puede pedirle que habilite los permisos de cámara, micrófono o ubicación
dependiendo de lo que esté habilitado en su proyecto. Haga clic en Permitir para que se le soliciten permisos a fin de
ver su experiencia en Live View.

Su proyecto puede tener un aspecto diferente en distintos dispositivos debido a las diferencias en el tamaño de la ventana gráfica de la web móvil
. O puede que quieras ver tu proyecto tanto en modo horizontal como vertical. En la parte superior izquierda de
del simulador, puede elegir entre un conjunto de tamaños de vista de dispositivo comunes, cambiar la orientación de
o utilizar el modo de respuesta para ajustarse a un tamaño personalizado. También puede hacer doble clic en los bordes
del panel Simulador para ajustar automáticamente el Simulador a la anchura del dispositivo seleccionado
viewport. **Nota: Las dimensiones se presentan en píxeles lógicos CSS (dimensiones de la ventana gráfica), no en píxeles del dispositivo físico
. Al seleccionar un dispositivo en el selector, sólo se actualizarán las dimensiones de la ventana gráfica
, no el agente de usuario del cliente.**

![SimulatorDeviceSelector](/images/simulator-device-selector.jpg)

## Conectar un dispositivo

1. En la parte inferior de la ventana de Studio, haz clic en el botón **Conectar dispositivo**.

2. Escanee el código QR con su dispositivo móvil para abrir un navegador web y obtener una vista previa en directo del proyecto.

![GettingStartedPreview](/images/editor-preview.jpg)

**Nota**: El código QR "Preview" es un \*\*código QR temporal, de un solo uso
\*\* destinado únicamente a ser utilizado por el desarrollador mientras trabaja activamente en el proyecto. Este código QR
te lleva a una URL privada, de desarrollo, y no es accesible por otros. Para compartir su trabajo con
, consulte la sección **Publicar su proyecto**.
