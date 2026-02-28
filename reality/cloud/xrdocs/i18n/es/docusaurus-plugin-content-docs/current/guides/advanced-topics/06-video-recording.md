---
id: video-recording
---

# Personalizar la grabación de vídeo

la biblioteca  [XRExtras](https://github.com/8thwall/web/tree/master/xrextras) de 8th Wall proporciona módulos que gestionan las necesidades más comunes de las aplicaciones WebAR, como la pantalla de carga, los flujos de enlace social y la gestión de errores.

El módulo XRExtras [MediaRecorder](https://github.com/8thwall/web/tree/master/xrextras/src/mediarecorder) facilita la personalización de la experiencia de usuario de grabación de vídeo en su proyecto.

Esta sección describe cómo personalizar los vídeos grabados con cosas como el comportamiento del botón de captura (pulsar en lugar de mantener pulsado), añadir marcas de agua en el vídeo, duración máxima del vídeo, comportamiento de la tarjeta y el aspecto, etc.

## Valor primitico de AFrame {#a-frame-primitives}

`xrextras-capture-button` : añade un botón de captura a la escena.

| Parámetro    | Tipo     | Por defecto  | Descripción                                                                                                                                                                                                                                                             |
| ------------ | -------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture-mode | `Cadena` | `'estándar'` | Establece el comportamiento del modo de captura. **estándar**: pulse para hacer una foto, pulse + mantenga pulsado para grabar un vídeo. **arreglado**: toque para alternar la grabación de vídeo. **foto**: toque para hacer una foto. Uno de `[estándar, fijo, foto]` |

`xrextras-capture-config`: Configura los archivos multimedia capturados.

| Parámetro               | Tipo       | Por defecto                         | Descripción                                                                                                                                                                                  |
| ----------------------- | ---------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| max-duration-ms         | int        | `15 000`                            | Duración total del vídeo (en milisegundos) que permite el botón de captura. Si la tarjeta final está desactivada, corresponde al tiempo máximo de grabación del usuario. 15 000 por defecto. |
| dimensión máxima        | int        | `1280`                              | Dimensión máxima (anchura o altura) del vídeo capturado.  Para configurar la foto, consulte [`XR8.CanvasScreenshot.configure()`](/api/canvasscreenshot/configure)                            |
| enable-end-card         | `Booleano` | `verdadero`                         | Si la tarjeta final está incluida en el soporte grabado.                                                                                                                                     |
| cover-image-url         | `Cadena`   |                                     | Fuente de la imagen de la portada de la tarjeta final. Utiliza por defecto la imagen de portada del proyecto.                                                                                |
| end-card-call-to-action | `Cadena`   | `'Pruébalo en: '`                   | Establece la cadena de texto para la llamada a la acción en la tarjeta final.                                                                                                                |
| short-link              | `Cadena`   |                                     | Establece la cadena de texto para el enlace corto de la tarjeta final. Utiliza el enlace corto del proyecto por defecto.                                                                     |
| footer-image-url        | `Cadena`   | Accionado por la imagen de 8th Wall | Fuente de la imagen del pie de página de la tarjeta final.                                                                                                                                   |
| watermark-image-url     | `Cadena`   | `nulo`                              | Fuente de la imagen para la marca de agua.                                                                                                                                                   |
| watermark-max-width     | int        | 20                                  | Anchura máxima (%) de la imagen con marca de agua.                                                                                                                                           |
| watermark-max-height    | int        | 20                                  | Altura máxima (%) de la imagen con marca de agua.                                                                                                                                            |
| watermark-location      | `Cadena`   | `'abajoDerecha'`                    | Ubicación de la imagen con marca de agua. Una de `arribaIzquierda, arribaMedio, arribaDerecha, abajoIzquierda, abajoMedio, abajoDerecha`                                                     |
| file-name-prefix        | `Cadena`   | `'my-capture-'`                     | Establece la cadena de texto que antepone la marca de tiempo única al nombre del archivo.                                                                                                    |
| request-mic             | `Cadena`   | `'auto'`                            | Determina si quiere configurar el micrófono durante la inicialización (`'auto'`) o durante el tiempo de ejecución (`'manual'`)                                                               |
| include-scene-audio     | `Booleano` | `verdadero`                         | Si es verdadero (true), los sonidos A-Frame de la escena formarán parte de la grabación.                                                                                                     |

`xrextras-capture-preview`: Añade una previsualización multimedia prefabricada a la escena que permite reproducir, descargar y compartir.

| Parámetro                | Tipo     | Por defecto   | Descripción                                                                                                                                            |
| ------------------------ | -------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| action-button-share-text | `Cadena` | `'Compartir'` | Establece la cadena de texto en el botón de acción cuando Web Share API 2 **está** disponible (Android, iOS 15 o superior). `'Compartir'` por defecto. |
| action-button-view-text  | `Cadena` | `'Ver'`       | Establece la cadena de texto en el botón de acción cuando Web Share API 2 **no** está disponible en iOS (iOS 14 o inferior). `'Ver'` por defecto.      |

## Eventos XRExtras.MediaRecorder {#xrextrasmediarecorder-events}

XRExtras.MediaRecorder emite los siguientes eventos.

#### Eventos emitidos {#events-emitted}

| Evento emitido                 | Descripción                                                                                                                                                                    | Detalle del evento |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| mediarecorder-photocomplete    | Se emite después de hacer una foto.                                                                                                                                            | {blob}             |
| mediarecorder-recordcomplete   | Se emite una vez finalizada la grabación de vídeo.                                                                                                                             | {videoBlob}        |
| mediarecorder-previewready     | Se emite una vez finalizada la grabación de un vídeo previsualizable. [(Solo Android/Portátil)](/api/mediarecorder/recordvideo/#parameters)                                    | {videoBlob}        |
| mediarecorder-finalizeprogress | Se emite cuando la grabadora multimedia está avanzando en la exportación final. [(Solo para Android y computadoras de escritorio)](/api/mediarecorder/recordvideo/#parameters) | {progress, total}  |
| mediarecorder-previewopened    | Se emite después de abrir la vista previa de la grabación.                                                                                                                     | null               |
| mediarecorder-previewclosed    | Se emite después de cerrar la vista previa de la grabación.                                                                                                                    | null               |

#### Ejemplo: Primitivas de A-Frame {#primitives-example}

```jsx
<xrextras-capture-button capture-mode="standard"></xrextras-capture-button>

<xrextras-capture-config
  max-duration-ms="15000"
  max-dimension="1280"
  enable-end-card="true"
  cover-image-url=""
  end-card-call-to-action="Try it at:"
  short-link=""
  footer-image-url="//cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-2.svg"
  watermark-image-url="//cdn.8thwall.com/web/img/mediarecorder/8logo.png"
  watermark-max-width="100"
  watermark-max-height="10"
  watermark-location="bottomRight"
  file-name-prefix="my-capture-"
></xrextras-capture-config>

<xrextras-capture-preview
  action-button-share-text="Share"
  action-button-view-text="View"
  finalize-text="Exporting..."
></xrextras-capture-preview>
```

#### Ejemplo: Eventos de A-Frame {#example-a-frame-events}

```javascript
window.addEventListener('mediarecorder-previewready', (e) => {
  console.log(e.detail.videoBlob)
})
```

#### Ejemplo: Cambiar CSS del botón Compartir {#change-share-button-example}

```css
#actionButton {
  /* cambiar el color del botón de acción */
  background-color: #007aff !important;
}
```
