---
id: simulator
sidebar_position: 5
---

# Simulador

## Descripción general

Inicia el simulador para reproducir tu escena. Puede realizar modificaciones en las entidades de su espacio y
verlas reflejadas inmediatamente en el simulador. El simulador también te permite probar y ver los cambios del proyecto en diferentes tamaños de pantalla y
simula entornos reales sin necesidad de salir de Studio.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

## Simulador RA

Si estás desarrollando RA, puedes acceder a una colección de secuencias de cámara pregrabadas.
El simulador de realidad aumentada dispone de una serie de controles de reproducción y funciones prácticas, como
:

- Barra de reproducción, scrubber y tiradores de entrada/salida: Le permiten establecer puntos de bucle, lo que le proporciona un control granular
  sobre la secuencia seleccionada.
- Botón de recentrado (abajo a la derecha): Recentra la alimentación de la cámara a su origen. NOTA: También se llama a Recenter en
  cada vez que la secuencia hace un bucle y cada vez que se selecciona una nueva secuencia.

![ARSimulator](/images/studio/studio-ar-simulator.png)

Utilice el menú de selección de secuencia de la parte inferior izquierda para cambiar la secuencia AR. Puede utilizar el carrusel
para cambiar entre las opciones de la categoría de secuencia. La pausa de la secuencia sólo detiene el vídeo,
permitiéndole probar los cambios en el mismo fotograma. Arrastra los tiradores de reproducción para establecer puntos de bucle de entrada/salida.

![SimulatorSequenceSelector](/images/studio/studio-sequence-selector.png)

El botón de la cámara de la esquina inferior derecha abre la Vista en Directo, que sigue la misma lógica que la configuración de la cámara de tu proyecto. Live View le permite simular su proyecto utilizando la alimentación de su escritorio en lugar de una secuencia AR pregrabada. Por ejemplo, si
su proyecto utiliza Efectos faciales y tiene el proyecto Studio abierto en el escritorio, se abrirá su cámara de escritorio
.

:::note
La Vista en Directo en el Simulador puede pedirle que habilite los permisos de cámara, micrófono o ubicación
dependiendo de lo que esté habilitado en su proyecto. Haga clic en Permitir para acceder a los avisos de permiso y poder
ver su experiencia en Live View.
:::

Su proyecto puede tener un aspecto diferente en distintos dispositivos debido a las diferencias en el tamaño de la ventana gráfica de la web móvil
. O puede que quieras ver tu proyecto tanto en modo horizontal como vertical. En la parte superior izquierda de
del simulador, puede elegir entre un conjunto de tamaños de vista de dispositivo comunes, cambiar la orientación de
o utilizar el modo de respuesta para ajustarse a un tamaño personalizado. También puede hacer doble clic en los bordes
del panel Simulador para ajustar automáticamente el Simulador a la anchura del dispositivo seleccionado
viewport. **Nota: Las dimensiones se presentan en píxeles lógicos CSS (dimensiones de la ventana gráfica), no en píxeles del dispositivo físico
. Al seleccionar un dispositivo en el selector, sólo se actualizarán las dimensiones de la ventana gráfica
, no el agente de usuario del cliente.**

![SimulatorDeviceSelector](/images/studio/studio-device-selector.png)

También puede simular coordenadas GPS específicas si está desarrollando una experiencia basada en la ubicación o en mapas.

![SimulatorLocation](/images/studio/studio-simulator-location.png)
